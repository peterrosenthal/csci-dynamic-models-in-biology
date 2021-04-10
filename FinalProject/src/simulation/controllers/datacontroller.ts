import Simulation from '../simulation';
import P5PlotFieldVsField from '../../graph/plotfieldvsfield';
import P5PlotFieldVsParam from '../../graph/plotfieldvsparam';

interface Data {
  name: string,
  title: string,
  values: number[],
}

/**
 * P5Plotter is a class that holds a bunch of simulation output data,
 * and hosts a bunch of p5 canvases to plot the data in real time.
 */
export default class DataController {
  public timesteps: Data;
  public radiusOfGyration: Data;
  public alignment: Data;

  public N: Data;
  public R: Data;
  public width: Data;
  public height: Data;
  public centerX: Data;
  public centerY: Data;
  public startX: Data;
  public startY: Data;
  public P: Data;
  public V: Data;
  public c1: Data;
  public c2: Data;
  public c3: Data;
  public c4: Data;
  public vlimit: Data;
  public repellantStrength: Data;

  public allData: Data[];

  public numRuns: number;

  public graphs: any[];

  private parent: HTMLElement;
  private simulation: Simulation;

  /**
   * @constructor
   * @param {HTMLElement} parent - the HTML object that houses all of the graph sketches.
   * @param {Simulation} simulation - the simulation object (parent of all other ts classes).
   */
  constructor(parent: HTMLElement, simulation: Simulation) {
    this.parent = parent;
    this.simulation = simulation;

    this.timesteps = {
      name: 'timesteps',
      title: 'Time',
      values: [],
    };
    this.radiusOfGyration = {
      name: 'radiusOfGyration',
      title: 'Radius of Gyration',
      values: [],
    };
    this.alignment = {
      name: 'alignment',
      title: 'Directional Aligmnent',
      values: [],
    };

    this.N = {
      name: 'N',
      title: 'Number of Boids',
      values: [],
    };
    this.R = {
      name: 'R',
      title: 'Number of Random Repellants',
      values: [],
    };
    this.width = {
      name: 'width',
      title: 'Domain Width',
      values: [],
    };
    this.height = {
      name: 'height',
      title: 'Domain Height',
      values: [],
    };
    this.centerX = {
      name: 'centerX',
      title: 'Domain Center X',
      values: [],
    };
    this.centerY = {
      name: 'centerY',
      title: 'Domain Center Y',
      values: [],
    };
    this.startX = {
      name: 'startX',
      title: 'Start Position X',
      values: [],
    };
    this.startY = {
      name: 'startY',
      title: 'Start Position Y',
      values: [],
    };
    this.P = {
      name: 'P',
      title: 'Start Position Random Spread',
      values: [],
    };
    this.V = {
      name: 'V',
      title: 'Start Velocity Random Spread',
      values: [],
    };
    this.c1 = {
      name: 'c1',
      title: 'Attraction Factor',
      values: [],
    };
    this.c2 = {
      name: 'c2',
      title: 'Repulsion Factor',
      values: [],
    };
    this.c3 = {
      name: 'c3',
      title: 'Alignment Factor',
      values: [],
    };
    this.c4 = {
      name: 'c4',
      title: 'Randomness Factor',
      values: [],
    };
    this.vlimit = {
      name: 'vlimit',
      title: 'Maximum Velocity',
      values: [],
    };
    this.repellantStrength = {
      name: 'repellantStrength',
      title: 'Repellant Strength',
      values: [],
    };

    this.allData = [
      this.timesteps, this.radiusOfGyration, this.alignment,
      this.N, this.R, this.width, this.height, this.centerX,
      this.centerY, this.startX, this.startY, this.P, this.V,
      this.c1, this.c2, this.c3, this.c4, this.vlimit, this.repellantStrength,
    ];

    this.graphs = [];

    const addGraphDiv: HTMLDivElement = document.getElementById('addGraphDiv') as HTMLDivElement;
    const newGraphDiv: HTMLDivElement = document.getElementById('newGraphDiv') as HTMLDivElement;
    const addGraphButton: HTMLButtonElement = document.getElementById('addGraphButton') as HTMLButtonElement;
    const newGraphButton: HTMLButtonElement = document.getElementById('newGraphButton') as HTMLButtonElement;
    const xAxisSelect: HTMLSelectElement = document.getElementById('xAxis') as HTMLSelectElement;
    const yAxisSelect: HTMLSelectElement = document.getElementById('yAxis') as HTMLSelectElement;

    newGraphDiv.style.display = 'none';

    addGraphButton.addEventListener('click', () => {
      newGraphDiv.style.display = 'block';
      addGraphButton.style.display = 'none';
    });

    newGraphButton.addEventListener('click', () => {
      const graphParent: HTMLDivElement = document.createElement<'div'>('div');
      graphParent.id = `graphSketch${this.graphs.length}`;

      this.parent.removeChild(addGraphDiv);
      this.parent.appendChild(graphParent);
      this.parent.appendChild(addGraphDiv);

      let xAxisData: Data;
      let yAxisData: Data;
      this.allData.forEach((data) => {
        if (data.name == xAxisSelect.value) {
          xAxisData = data;
        }
        if (data.name == yAxisSelect.value) {
          yAxisData = data;
        }
      });

      if (xAxisData == undefined || yAxisData == undefined) {
        console.log(xAxisSelect.value);
        console.log(yAxisSelect.value);
      } else {
        if (xAxisSelect.value == 'timesteps' ||
            xAxisSelect.value == 'radiusOfGyration' ||
            xAxisSelect.value == 'alignment') {
          this.graphs.push(
            new P5PlotFieldVsField(
              xAxisData.values,
              yAxisData.values,
              this.c4.values, // find an easy way to ui this one too
              graphParent,
              `${xAxisData.title} vs ${yAxisData.title}`,
              xAxisData.title,
              yAxisData.title,
            ),
          );
        } else {
          this.graphs.push(
            new P5PlotFieldVsParam(
              xAxisData.values,
              yAxisData.values,
              this.timesteps.values,
              graphParent,
              `${xAxisData.title} vs\nTime Averaged ${yAxisData.title}`,
              xAxisData.title,
              yAxisData.title,
            ),
          );
        }
      }

      newGraphDiv.style.display = 'none';
      addGraphButton.style.display = 'block';
    });

    /* const parents: HTMLElement[] = [
      document.getElementById('graphSketch0'),
      document.getElementById('graphSketch1'),
      document.getElementById('graphSketch2'),
    ];
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.radiusOfGyration, this.c4, parents[0]));
    this.graphs.push(new P5PlotFieldVsParam(this.alignment, this.c4, this.timesteps, parents[1]));
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.alignment, this.c4, parents[2])); */
  }
}
