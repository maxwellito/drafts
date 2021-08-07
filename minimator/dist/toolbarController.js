import { VisualComponent } from './visualComponent.js';
const template = `
  <div class="toolbar">
    <button data-bit="export">Export</button>
  <div>
`;
export class ToolbarController extends VisualComponent {
    listeners = [];
    constructor() {
        super(template);
        this.bits.get('export')?.addEventListener('click', this.export.bind(this));
    }
    on(listener) {
        this.listeners.push(listener);
    }
    export() {
        this.listeners.forEach(l => l('export', null));
    }
}
