class Hyperparameters:
    def __init__(self, discount_rate: float, log_interval: int, max_episodes: int, max_timesteps: int, stagger_interval: int):
        self.discount_rate = discount_rate
        self.log_interval = log_interval
        self.max_episodes = max_episodes
        self.max_timesteps = max_timesteps
        self.stagger_interval = stagger_interval