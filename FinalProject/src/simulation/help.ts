/**
 * A class that initalizes the help button.
 * It doesn't really need to be a class tbh,
 * but everything else is, so it looks more
 * neat and orderly if it is a class :)
 */
export default class Help {
  public element: HTMLElement;
  public button: HTMLButtonElement;

  /**
   * @constructor
   */
  constructor() {
    this.element = document.getElementById('helpDiv');
    this.button = document.getElementById('helpButton') as HTMLButtonElement;

    this.element.style.display = 'none';
    this.button.addEventListener('click', () => {
      if (this.element.style.display == 'none') {
        this.element.style.display = 'block';
      } else {
        this.element.style.display = 'none';
      }
    });
  }
}