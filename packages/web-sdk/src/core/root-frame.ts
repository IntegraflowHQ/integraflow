import '../styles/globals.css';

import { onDOMReady } from '../utils';

export interface RootFrameContainer {
  name: string;
  element: HTMLDivElement;
}

export class RootFrame {
  public readonly element: HTMLDivElement;
  public readonly containers: RootFrameContainer[];
  
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'integraflow-container';
    this.containers = [];
    
    onDOMReady(() => document.body.appendChild(this.element));
  }
  
  createContainer(name: string) {
    const container = {
      name,
      element: document.createElement('div')
    };
    
    container.element.id = `integraflow-container-${name}`;
    this.element.appendChild(container.element);
    
    this.containers.push(container);
    
    return container;
  }
  
  removeContainer(name: string) {
    const idx = this.containers.findIndex(container => container.name === name);

    if (idx >= 0) {
      this.containers[idx].element.remove();
      this.containers.splice(idx, 1);
    }
  }
}
