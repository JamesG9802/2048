from typing import List 
from collections import namedtuple

import numpy as np

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.distributions import Categorical

from hyperparameters import Hyperparameters

SavedAction = namedtuple('SavedAction', ['log_prob', 'value'])
eps = np.finfo(np.float32).eps.item()

class ActorCriticPolicy(nn.Module):
    def __init__(self, outputs):
        super().__init__()


        # self.common_head = nn.Linear(4, 128)
        self.conv_head = nn.Conv2d(1, 16, 2)

        #   Convolutional size = BOARD_SIZE * (HEIGHT - KERNEL_SIZE + STRIDE) * (WIDTH - KERNEL_SIZE + STRIDE)
        conv_size = 4 * 4 * (4 - 2 + 1) * (4 - 2 + 1)

        self.action_head = nn.Linear(conv_size, outputs)

        self.critic_head = nn.Linear(conv_size, 1)

        # action & reward buffer
        self.saved_actions = []
        self.rewards = []
        
    def forward(self, input: torch.Tensor, action_mask: torch.Tensor):
        """
        forward of both actor and critic
        """
        x = F.relu(self.conv_head(input)).reshape(-1)

        # actor: choses action to take from state s_t
        # by returning probability of each action
        logits = self.action_head(x)
        logits = logits + (action_mask.reshape(-1) - 1) * 1e9

        action_prob = F.softmax(logits, dim=-1)

        # critic: evaluates being in the state s_t
        state_values = self.critic_head(x)

        # return values for both actor and critic as a tuple of 2 values:
        # 1. a list with the probability of each action over the action space
        # 2. the value from state s_t
        return action_prob, state_values

    def select_best_action(self, state, action_mask):
         # state = torch.from_numpy(state).float()
        probs, state_value = self.forward(state, action_mask)

        return probs.argmax(-1).item()

    def select_action(self, state, action_mask):  
        # state = torch.from_numpy(state).float()
        probs, state_value = self.forward(state, action_mask)

        # create a categorical distribution over the list of probabilities of actions
        m = Categorical(probs)

        # and sample an action using the distribution
        action = m.sample()

        # save to action buffer
        self.saved_actions.append(SavedAction(m.log_prob(action), state_value))

        # the action to take (left or right)
        return action.item()

    def reward_action(self, reward: float):
        self.rewards.append(reward)

    def episode_ended(self, optimizer, hyperparameters: Hyperparameters):
        """
        Training code. Calculates actor and critic loss and performs backprop.
        """
        R = 0
        saved_actions = self.saved_actions
        policy_losses = [] # list to save actor (policy) loss
        value_losses = [] # list to save critic (value) loss
        returns = [] # list to save the true values

        # calculate the true value using rewards returned from the environment
        for r in self.rewards[::-1]:
            # calculate the discounted value
            R = r + hyperparameters.discount_rate * R
            returns.insert(0, R)

        returns = torch.tensor(returns)
        returns = (returns - returns.mean()) / (returns.std() + eps)

        for (log_prob, value), R in zip(saved_actions, returns):
            advantage = R - value.item()

            # calculate actor (policy) loss
            policy_losses.append(-log_prob * advantage)

            # calculate critic (value) loss using L1 smooth loss
            value_losses.append(F.smooth_l1_loss(value, torch.tensor([R])))

        # reset gradients
        optimizer.zero_grad()

        # sum up all the values of policy_losses and value_losses
        loss = torch.stack(policy_losses).sum() + torch.stack(value_losses).sum()

        # perform backprop
        loss.backward()
        optimizer.step()

        # reset rewards and action buffer
        del self.rewards[:]
        del self.saved_actions[:]

