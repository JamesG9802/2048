from random import Random, random
import torch

from actor_critic_policy import ActorCriticPolicy
from environment import Environment
from hyperparameters import Hyperparameters

if __name__ == "__main__":
    #   Setup the environment, policy, and hyperparameters.
    env: Environment = Environment()
    hyperparameters: Hyperparameters = Hyperparameters(.99, 100, 10000, 300, 0)

    player_policy: ActorCriticPolicy = ActorCriticPolicy(4)

    # player_policy = torch.load("./player_policy", weights_only=False)

    optimizer_p = torch.optim.Adam(player_policy.parameters())

    highest: float = 0
    rolling_average: float = 0

    rng = Random()

    for episode in range(1, hyperparameters.max_episodes):
        env.reset()
        
        while env.Timestep < hyperparameters.max_timesteps:
            game_over: bool = False

            #   Policy sliding the board.
            if env.Timestep % 2 == 0:
                obs, mask = env.player_observe()
                action: int = player_policy.select_action(obs, mask)
                game_over = env.player_step(action)
                #   Disincentivize long games.
                player_policy.reward_action(-1)
            #   Randomly placing a tile
            else:
                avail = []
                for i in range(16):
                    if env.Board[i] == 0:
                        avail.append(i)
                torch.randperm(len(avail))[0].item()
                obs, mask = env.machine_observe()

                game_over = env.machine_step(avail[torch.randperm(len(avail))[0].item()], 1 if rng.random() < .9 else 2)

            if game_over:
                if env.Timestep > highest:
                    highest = env.Timestep
                rolling_average += env.Timestep
                break

        if env.Timestep == hyperparameters.max_timesteps:
            rolling_average += env.Timestep
            highest = hyperparameters.max_timesteps
            
        player_policy.episode_ended(optimizer_p, hyperparameters)

        if episode % hyperparameters.log_interval == 0:
            print(f"Average:\t{rolling_average / hyperparameters.log_interval}\tHighest:\t{highest}")
            rolling_average = 0
            highest = 0
    torch.save(player_policy, "./player_policy")