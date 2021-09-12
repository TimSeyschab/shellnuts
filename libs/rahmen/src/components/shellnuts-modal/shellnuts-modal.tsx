import {Component, h, Prop, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'shellnuts-modal',
  styleUrl: 'shellnuts-modal.scss',
  shadow: true,
})
export class ShellnutsModal {
  @Prop() visible: boolean = false;
  @Prop() title: string = '';

  /**
   * The last name
   */
  @Event() clicked: EventEmitter<boolean>;

  private _onClick() {
    this.clicked.emit(true);
  }

  render() {
    return (
      <div class={this.visible ? 'wrapper visible' : 'wrapper'}>
        <div class='modal'>
          <span class='title'>{this.title}</span>
          <div class='content'>
            <slot />
          </div>
          <div class='button-container'>
            <button class='ok' onClick={() => this._onClick()}>Okay</button>
          </div>
        </div>
      </div>
    );
  }

}
