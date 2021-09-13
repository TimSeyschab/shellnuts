import { Component, h, Prop } from '@stencil/core';

export interface ShellnutsCardProp {
  titel: string;
  author: string;
  text: string[];
}

@Component({
  tag: 'shellnuts-card',
  styleUrl: 'shellnuts-card.scss',
  shadow: true,
})
export class ShellnutsCard {
  @Prop() cardProp: ShellnutsCardProp;

  render() {
    return (
      <div class="card">
        <div class="card-title-block">
          <div class="card-title">
            <div class="card-val">
              {this.cardProp.titel}
            </div>
          </div>
          <div class="card-author">
            <div class="card-val">
              <span class="mu mu-user"/>
              {this.cardProp.author}
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="card-val">
            {this.cardProp.text.map((value) => {
              return <p>{value}</p>
            })}
          </div>
        </div>
      </div>
    );
  }
}


