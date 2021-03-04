import matplotlib.pyplot as plt
import math
import numpy as np
import random
import pylab


class random_walks_python():
    def random_walks_part_1(self):
        N = 500  # no of steps per trajectory
        realizations = 5000 # number of trajectories
        v = 1.0  # velocity (step size)
        theta_s_array = [round(math.pi / 24, 4),
                         round(math.pi / 12, 4),
                         round(math.pi / 3, 4)]  # the width of the random walk turning angle distribution (the lower it is, the more straight the trajectory will be)
        w_array = [0.0, 0.5, 1.0]  # w is the weighting given to the directional bias (and hence (1-w) is the weighting given to correlated motion)

        efficiency_array = np.zeros([len(theta_s_array), len(w_array), N])

        plt.figure(1)
        plt.suptitle('An Overview of Part 1')
        for w_i, w in enumerate(w_array):
            plt.subplot(131 + w_i)
            for theta_s_i, theta_s in enumerate(theta_s_array):
                efficiency_array[theta_s_i, w_i, :] = self.BCRW(N, realizations, v, theta_s, theta_s, w)
                plt.plot(range(N), efficiency_array[theta_s_i, w_i, :])
            plt.axis([0, N, 0, np.amax(efficiency_array[:, w_i, :])])
            plt.title('$w = {}$'.format(w_array[w_i]))
            plt.xlabel('Timestep')
            plt.ylabel('Navigational Efficiency')
        legend_array = []
        for theta_s_i, theta_s in enumerate(theta_s_array):
            legend_array.append(['$\theta^{*CRW}=$', theta_s, '$\theta^{*BRW}=$', theta_s])
        plt.figlegend(labels = legend_array, loc='center right')

        plt.figure(2)
        plt.title('Navigational Efficiency over time\nw = 0, theta_star = pi/3')
        plt.xlabel('Timestep')
        plt.ylabel('Navigational Efficiency')
        plt.plot(range(N), efficiency_array[2, 0, :], label='# of realizations = {}'.format(realizations))
        n_5000_max = np.amax(efficiency_array[2, 0, :])
        n_5000_min = np.amin(efficiency_array[2, 0, :])

        realizations_array = [50, 100, 500, 1000]
        theta_s = round(math.pi / 3, 4)
        w = 0

        efficiency_array = np.zeros([len(realizations_array), N])

        for realizations_i, num_realizations in enumerate(realizations_array):
            efficiency_array[realizations_i, :] = self.BCRW(N, num_realizations, v, theta_s, theta_s, w)
            plt.plot(range(N), efficiency_array[realizations_i, :], label='# of realizations = {}'.format(num_realizations))
        plt.axis([0, N, min(np.amin(efficiency_array), n_5000_min), max(np.amax(efficiency_array), n_5000_max)])
        # reorder the legend handles, thanks to: https://stackoverflow.com/a/46160465
        handles, labels = plt.gca().get_legend_handles_labels()
        order = [1, 2, 3, 4, 0]
        plt.legend([handles[idx] for idx in order], [labels[idx] for idx in order])

    
    def random_walks_part_2(self):
        N = 500
        realizations = 500
        v = 1.0
        theta_s_crw = round(math.pi / 30, 4)
        theta_s_brw = round(math.pi / 3, 4)
        w_array = np.linspace(0.0, 1.0, 500)

        efficiency_array = np.zeros([len(w_array), N])

        for w_i, w in enumerate(w_array):
            efficiency_array[w_i, :] = self.BCRW(N, realizations, v, theta_s_crw, theta_s_brw, w)
        
        w_best = w_array[round(np.argmax(efficiency_array[:, N-1]))]
        max_efficiency = np.max(efficiency_array)
        print('Weight: {}, Efficiency: {}'.format(w_best, max_efficiency))

        plt.figure(3)
        plt.axis([0, N, 0, 1])
        plt.title('Navigational Efficiency in w-N space\ntheta_s_crw=pi/30, theta_s_brw=pi/3')
        plt.xlabel('Timestep')
        plt.ylabel('Weight BRW')
        plt.contourf(range(N), w_array, efficiency_array, 100)
        plt.contour(range(N), w_array, efficiency_array, 12, colors='black', linewidths=1.25)
        plt.plot([0, N], [w_best, w_best], linewidth=0.75, color='black', linestyle='dashed')
        plt.annotate('w = {}, Efficiency = {}'.format(w_best, max_efficiency), (max_efficiency, N))

    # The function generates 2D-biased correlated random walks, and calculates the navigational efficiency along the way
    def BCRW(self, N, realizations, v, theta_s_crw, theta_s_brw, w):
        efficiency_array = np.zeros(N)
        X = np.zeros([realizations, N])
        Y = np.zeros([realizations, N])
        theta = np.zeros([realizations, N])
        X[:, 0] = 0
        Y[:, 0] = 0
        theta[:, 0] = 0

        for step_i in range(1, N):
            for realization_i in range(realizations):
                theta_crw = theta[realization_i][step_i - 1] + (theta_s_crw * 2.0 * (np.random.rand(1, 1) - 0.5))
                theta_brw = (theta_s_brw * 2.0 * (np.random.rand(1, 1) - 0.5))

                X[realization_i, step_i] = X[realization_i][step_i - 1] + (v * (w * math.cos(theta_brw))) + (
                            (1 - w) * math.cos(theta_crw))
                Y[realization_i, step_i] = Y[realization_i][step_i - 1] + (v * (w * math.sin(theta_brw))) + (
                            (1 - w) * math.sin(theta_crw))

                current_x_disp = X[realization_i][step_i] - X[realization_i][step_i - 1]
                current_y_disp = Y[realization_i][step_i] - Y[realization_i][step_i - 1]
                current_direction = math.atan2(current_y_disp, current_x_disp)

                theta[realization_i, step_i] = current_direction
            efficiency_array[step_i] = np.divide(np.mean(X[:, step_i] - X[:, 0]), (v * step_i))

        return efficiency_array


random_walks = random_walks_python()
random_walks.random_walks_part_1()
random_walks.random_walks_part_2()
plt.show()
