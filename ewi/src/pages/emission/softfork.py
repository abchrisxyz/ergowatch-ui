import numpy as np
from matplotlib import pyplot as plt
# plt.style.use('ggplot')

# Emission settings
initial_rate = 75
variable_rate_start = 525600
epoch_length = 64800
step = 3


def circ_supply(height: int, nano: bool = False) -> int:
    """
    Circulating supply at given height, in ERG (or nanoERG).
    """
    # At current height
    completed_epochs = max(0, height - variable_rate_start) // epoch_length
    # current_epoch = completed_epochs + min(1, completed_epochs)
    current_epoch = completed_epochs + 1 if height >= variable_rate_start else 0
    # blocks_in_current_epoch = max(0, height - variable_rate_start) % epoch_length
    blocks_in_current_epoch = (height - variable_rate_start) % epoch_length + 1 if height >= variable_rate_start else 0
    current_rate = max(0, initial_rate - current_epoch * step)
    
    # Components
    fixed_period_cs = min(variable_rate_start - 1, height) * initial_rate
    completed_epochs_cs = sum(
        [
            # epoch_length * max(0, initial_rate - step * (i + 1))
            epoch_length * emission_rate_from_epoch(i+1)
            for i in range(completed_epochs)
        ]
    )
    current_epoch_cs = blocks_in_current_epoch * current_rate

    # Circulating supply
    cs = fixed_period_cs + completed_epochs_cs + current_epoch_cs
    if nano:
        cs *= 10**9

    
    
    return [cs, current_rate]


def emission_rate_from_epoch(epoch: int) -> int:
    """
    Return emission rate applied during given epoch.

    Epochs 1 starts at 525600 etc...
    """
    return max(0, initial_rate - step * (epoch))


def sampling_rate(rate: int) -> int:
    """
    Returns soft fork sampling rate from original emission rate
    """
    return 12 if rate >= 15 else max(0, rate - 3)


def circ_supply2(height: int, nano: bool = False) -> int:
    """
    Circulating supply at given height, in ERG (or nanoERG).
    """
    # Emission settings
    initial_rate = 75
    variable_rate_start = 525600
    epoch_length = 64800
    step = 3

    soft_fork_height = 699393
    # initial_emission_sample = 12
    # adjusted_emission_diff = 3
    reemission_adjustment_height = 1821599 # last block with emission rate >= 15

    # At current height
    completed_epochs = max(0, height - variable_rate_start) // epoch_length
    current_epoch = completed_epochs + 1 if height >= variable_rate_start else 0
    blocks_in_current_epoch = (height - variable_rate_start) % epoch_length + 1 if height >= variable_rate_start else 0
    current_rate = max(0, initial_rate - current_epoch * step)
    
    # Components
    fixed_period_cs = min(variable_rate_start - 1, height) * initial_rate
    completed_epochs_cs = sum(
        [
            epoch_length * emission_rate_from_epoch(i+1)
            for i in range(completed_epochs)
        ]
    )
    current_epoch_cs = blocks_in_current_epoch * current_rate

    
    # Reserved to re-emission contract - i.e. what goes into the contract
    # Soft fork kicks somewhere halfway in 3rd epoch, when emission rate is 66 ERG/block.
    reserved = 0
    if height >= soft_fork_height:
        last_block_at_66 = 719999
        blocks = min(height - soft_fork_height + 1 , last_block_at_66 - soft_fork_height + 1)
        reserved += 12 * blocks
    
        for i in range(completed_epochs):
            epoch = i + 1
            if epoch > 3:
                reserved += sampling_rate(emission_rate_from_epoch(epoch)) * epoch_length
    
        # Current epoch (if in 3rd, then already handled above)
        if current_epoch > 3:
            reserved+= blocks_in_current_epoch * sampling_rate(current_rate)
    
    # Re-emitted supply - what goes out of the contract
    reemission_rate = 3
    reemitted = max(0, height - 2080800 + 1) * reemission_rate
    reserved -= min(reserved, reemitted)
    # print(height, reemitted, reserved);

    # Circulating supply
    original_cs = fixed_period_cs + completed_epochs_cs + current_epoch_cs
    soft_fork_cs = original_cs - reserved
    if nano:
        cs *= 10**9

    print(height, current_rate, sampling_rate(current_rate), reserved)
    
    return [original_cs, current_rate, sampling_rate(current_rate), reserved, soft_fork_cs]



if __name__ == "__main__":

    h = 525599
    assert(circ_supply2(h)[0] == 39419925)
    assert(circ_supply2(h)[1] == 75)

    h = 525600
    assert(circ_supply2(h)[0] == 39419997)
    assert(circ_supply2(h)[1] == 72)

    h = 525601
    assert(circ_supply(h)[0] == 39420069)
    assert(circ_supply(h)[1] == 72)

    h = 590399
    assert(circ_supply(h)[0] == 44085525)
    assert(circ_supply(h)[1] == 72)

    h = 590400
    assert(circ_supply(h)[0] == 44085594)
    assert(circ_supply(h)[1] == 69)

    h = 647322
    assert(circ_supply(h)[0] == 48013212)
    assert(circ_supply(h)[1] == 69)


    # h = 525599; circ_supply(h)
    # h = 525600; circ_supply(h)
    # h = 590398; circ_supply(h)
    # h = 590399; circ_supply(h)
    # h = 590400; circ_supply(h)
    # h = 590401; circ_supply(h)

    heights = [
    0,
    525599,
    525600,
    590399,
    590400,
    655199,
    655200,
    719999,
    720000,
    784799,
    784800,
    849599,
    849600,
    914399,
    914400,
    979199,
    979200,
    1043999,
    1044000,
    1108799,
    1108800,
    1173599,
    1173600,
    1238399,
    1238400,
    1303199,
    1303200,
    1367999,
    1368000,
    1432799,
    1432800,
    1497599,
    1497600,
    1562399,
    1562400,
    1627199,
    1627200,
    1691999,
    1692000,
    1756799,
    1756800,
    1821599,
    1821600,
    1886399,
    1886400,
    1951199,
    1951200,
    2015999,
    2016000,
    2080799,
    2080800,
    3000000,
    4000000,
    5000000,
    6000000,
    6958426,
    6958427,
    6958428,
    6958427,
]

data = [circ_supply(h) for h in heights]
emission1 = [d[0] for d in data]
original_rates1 = [d[1] for d in data]


data = [circ_supply2(h) for h in heights]
original_emission = [d[0] for d in data]
original_rates = [d[1] for d in data]
reserve_rates = [d[2] for d in data]
reserves = [d[3] for d in data]
new_emission = [d[4] for d in data]

# for i, h in enumerate(heights):
#     print(h, original_emission[i], original_rates[i], reserve_rates[i], reserves[i], new_emission[i], i)


fig, axs = plt.subplots(2, 2)
axs[0, 0].plot(heights, original_emission, 'k')
axs[0, 0].plot(heights, new_emission, 'r')
axs[0, 0].plot(heights, emission1, 'c')
axs[0, 1].plot(heights, original_rates, 'k')
axs[0, 1].plot(heights, reserve_rates, 'r')
axs[1, 0].plot(heights, reserves)


plt.show()
