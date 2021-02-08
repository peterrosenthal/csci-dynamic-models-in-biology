import matplotlib.pyplot as plt
import math
import numpy as np


def Polymer_MD_Vary_N():
    # Loop over various N and save the result
    N = [25, 20, 5]
    T = 0.05
    dt = 0.0005
    steps = 200000

    epsilon_LJ = 1
    cutoff_LJ = 2.5
    spring_coeff = 5
    min_sep = 1.122

    print_interval = 500

    radius_gy = np.zeros((len(N), steps))
    radius_gy_rms = np.zeros((len(N), steps))

    for n_i, n in enumerate(N):
        x = initial_configuration(min_sep, n)

        for step_i in range(0, steps):
            x, pairs = steepest_descent(n, x, dt, cutoff_LJ, epsilon_LJ, min_sep, spring_coeff, T)
            radius_gy[n_i, step_i] = radius_of_gyration(n, x)
            radius_gy_rms[n_i, step_i] = radius_of_gyration_rms(n, x)
            if np.mod(step_i - 1, print_interval) == 0:
                print("step =", step_i, "  N =", n, "  radius_of_gyration =", radius_gy[n_i, step_i])
                visualize_particles(x, step_i, print_interval, "part-1-" + str(n_i))

    np.save("part_1-radius_of_gyration.npy", radius_gy)
    np.save("part_1-radius_of_gyration_rms.npy", radius_gy_rms)


def Polymer_MD_Vary_LJ():
    # Loop over various epsilon_LJ and save the result
    N = 25
    T = 0.05
    dt = 0.0005
    steps = 200000

    epsilon_LJ = [1, 0.5, 0]
    cutoff_LJ = 2.5
    spring_coeff = 5
    min_sep = 1.122

    print_interval = 500

    radius_gy = np.zeros((len(epsilon_LJ), steps))
    radius_gy_rms = np.zeros((len(epsilon_LJ), steps))

    x = initial_configuration(min_sep, N)
    for e_i, e in enumerate(epsilon_LJ):

        for step_i in range(0, steps):
            x, pairs = steepest_descent(N, x, dt, cutoff_LJ, e, min_sep, spring_coeff, T)
            radius_gy[e_i, step_i] = radius_of_gyration(N, x)
            radius_gy_rms[e_i, step_i] = radius_of_gyration_rms(N, x)
            if np.mod(step_i - 1, print_interval) == 0:
                print("step =", step_i, "  epsilon_LJ =", e, "  radius_of_gyration =", radius_gy[e_i, step_i])
                visualize_particles(x, step_i, print_interval, "part-2-" + str(e_i))

    np.save("part_2-radius_of_gyration.npy", radius_gy)
    np.save("part_2-radius_of_gyration_rms.npy", radius_gy_rms)


def initial_configuration(initial_min_sep, N):
    x = np.zeros((N, 2))
    for i in range(0, N):
        x[i][0] = initial_min_sep * i - (initial_min_sep * N / 2)
    return x


def steepest_descent(N, x, dt, cutoff_LJ, epsilon_LJ, min_sep, spring_coeff, T):
    F_particles, _, pairs = forces(N, x, cutoff_LJ, epsilon_LJ, min_sep, spring_coeff)
    F = F_particles
    x = x + (dt * F) + np.dot(T, (np.random.rand(x.shape[0], x.shape[1]) - 0.5))
    return x, pairs


def all_interactions(N, x, cutoff):  # obtain interacting pairs
    ip = 0
    connector = []
    pair = []
    for i in range(0, N - 1):
        for j in range(i + 1, N):
            distance = x[j, :] - x[i, :]  # distance : (1x2)
            if np.linalg.norm(distance) < cutoff:
                ip = ip + 1
                pair.append([i, j])
                connector.append([distance])
    return ip, pair, connector


# Obtain interacting pairs
def spring_interactions(N, x):
    ip = 0
    connector = []
    pair = []
    for i in range(0, N - 1):
        j = i + 1
        distance = x[j, :] - x[i, :]
        ip += 1  # interaction pair counter
        pair.append([i, j])  # particle numbers (i,j) belonging to pair (ip)
        connector.append([distance])
    return ip, pair, connector


def forces(N, x, cutoff_LJ, epsilon_LJ, min_sep, spring_coeff):
    F = np.zeros((N, 2))
    P = np.zeros((N, 2))
    # LJ Forces
    no, pair, connector = all_interactions(N, x, cutoff_LJ)  # interacting pairs
    for i in range(0, no):
        FORCE = force_LJ(connector[i], epsilon_LJ)
        F[pair[i][0]] = F[pair[i][0]] - FORCE
        F[pair[i][1]] = F[pair[i][1]] + FORCE  # action = reaction
        P[pair[i][0]] = P[pair[i][0]] + (np.sum(FORCE * connector[i], axis=0))
        P[pair[i][1]] = P[pair[i][1]] + (np.sum(FORCE * connector[i], axis=0))

    # Spring Forces
    no, pair, connector = spring_interactions(N, x)  # interacting pairs
    for i in range(0, no):
        FORCE = force_springs(connector[i], spring_coeff, min_sep)
        F[pair[i][0]] = F[pair[i][0]] - FORCE
        F[pair[i][1]] = F[pair[i][1]] + FORCE  # action = reaction;
        P[pair[i][0]] = P[pair[i][0]] + (np.sum(FORCE * connector[i], axis=0))
        P[pair[i][1]] = P[pair[i][1]] + (np.sum(FORCE * connector[i], axis=0))
    return F, P, pair


def force_springs(r_vector, spring_coeff_array, min_sep):
    r2 = np.sum(np.square(r_vector), axis=1)
    r = np.sqrt(r2)
    r = r.flatten()
    curr_force = np.zeros((len(r2), 2))
    val_1 = np.multiply(np.subtract(r, min_sep), np.divide(r_vector[0][0], r), out=None)
    val_2 = np.multiply(np.subtract(r, min_sep), np.divide(r_vector[0][1], r), out=None)
    curr_force[0][0] = np.multiply(np.transpose(-spring_coeff_array), val_1)
    curr_force[0][1] = np.multiply(np.transpose(-spring_coeff_array), val_2)
    return curr_force


def force_LJ(r_vector, epsilon_LJ):
    r = np.linalg.norm(r_vector)
    force_LJ = 24 * epsilon_LJ * np.dot((np.dot(2, r ** (-14)) - r ** (-8)), r_vector)
    return force_LJ


def radius_of_gyration(N, x):
    sum_rad_gy = 0
    for i in range(0, N):
        for j in range(0, N):
            if not i == j:
                diff = (x[i, :] - x[j, :])
                sum_rad_gy += (diff[0] * diff[0] + diff[1] * diff[1])
    return sum_rad_gy / (2 * N * N)


def radius_of_gyration_rms(N, x):
    center_of_mass = np.zeros(2)
    sum_rad_gy = 0
    for i in range(0, N):
        center_of_mass += x[i, :]
    center_of_mass /= N
    for i in range(0, N):
        diff = (center_of_mass - x[i, :])
        sum_rad_gy += (diff[0] * diff[0] + diff[1] * diff[1])
    return math.sqrt(sum_rad_gy / N)


def plot_radius_of_gyration(in_file, out_file, title, legend):
    radii = np.load(in_file)
    for radius in radii:
        plt.plot(np.arange(1, len(radius) + 1), radius)
    plt.title(title)
    plt.legend(legend)
    plt.xlabel("timestep")
    plt.ylabel("radius of gyration")
    plt.savefig(out_file, format="png")
    plt.clf()


def visualize_particles(x, step, save_interval, folder):
    plt.ylim([-10, 10])
    plt.xlim([-10, 10])
    plt.scatter(x[:, 0], x[:, 1])
    frame_num = (step - 1) / save_interval + 1
    plt.savefig(folder + "/" + f"{frame_num:06d}" + ".png", format="png")
    plt.clf()


# Step 1: Modified "main" method for calculating part 1
Polymer_MD_Vary_N()

# Step 2: Modified "main" method for calculating part 2
Polymer_MD_Vary_LJ()

# Step 3: Create graphs from the data calculated in parts 1 and 2
plot_radius_of_gyration("part_1-radius_of_gyration.npy", "part_1-radius_of_gyration.png",
                        "Radius of Gyration\n(HW1 PDF definition)", ["N=25", "N=20", "N=5"])

plot_radius_of_gyration("part_1-radius_of_gyration_rms.npy", "part_1-radius_of_gyration_rms.png",
                        "Radius of Gyration\n(Wikipedia definition)", ["N=25", "N=20", "N=5"])

plot_radius_of_gyration("part_2-radius_of_gyration.npy", "part_2-radius_of_gyration.png",
                        "Radius of Gyration\n(HW1 PDF definition)",
                        ["epsilon_LJ=1", "epsilon_LJ=0.5", "epsilon_LJ=0"])

plot_radius_of_gyration("part_2-radius_of_gyration_rms.npy", "part_2-radius_of_gyration_rms.png",
                        "Radius of Gyration\n(Wikipedia definition)",
                        ["epsilon_LJ=1", "epsilon_LJ=0.5", "epsilon_LJ=0"])
