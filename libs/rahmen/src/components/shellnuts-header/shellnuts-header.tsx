import {Component, h, Prop} from '@stencil/core';

export interface ShellnutsHeaderProps {
  urlList: ShellnutsHeaderUrl[];
}

export interface ShellnutsHeaderUrl {
  url: string;
  shortName: string;
  longName: string;
}

@Component({
  tag: 'shellnuts-header',
  styleUrl: 'shellnuts-header.scss',
  shadow: true,
})
export class ShellnutsHeader {

  @Prop() headerProp: ShellnutsHeaderProps;
  @Prop() default: boolean = false;

  private getProps() {
    if(this.default){
      return this.defaultProp;
    }
    return this.headerProp;
  }

  render() {
    return (
      <header class='masthead'>
        <div class='brand-container'>
          <a href='#'>
            <span class='brand-initials'>SN</span>
            <span class='brand-name'>Shellnuts</span>
          </a>
        </div>
        <nav>
          <div class='nav-container'>
            {this.getProps().urlList.map(value => {
              return (
                <div>
                  <a class='slide' href={value.url}>
                    <span class='element'>{value.shortName}</span>
                    <span class='name'>{value.longName}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </nav>
      </header>
    );
  }

  defaultProp={
    urlList: [
      {
        url: "/index.html",
        shortName: "Hm",
        longName: "Home"
      },
      {
        url: "/pages/rezepte/rezepte.html",
        shortName: "Rzp",
        longName: "Rezepte"
      },
      {
        url: "/pages/artikel/artikel.html",
        shortName: "At",
        longName: "Artikel"
      }
    ]
  }
}
