import {Component, Fragment, h, State} from '@stencil/core';

@Component({
  tag: 'shellnuts-footer',
  styleUrl: 'shellnuts-footer.scss',
  shadow: true,
})
export class ShellnutsFooter {
  @State()
  visible: boolean = false;

  private clicked() {
    this.visible = true;
  }

  private modalClosed() {
    this.visible=false;
  }

  render() {
    return (
      <Fragment>
        <div class="sitefooter">
          <div class="footerlarge"/>
          <div class="footersmall">
            <button class="impressum" onClick={() => this.clicked()}>Impressum</button>
          </div>
        </div>
        <shellnuts-modal onClicked={() => this.modalClosed()} title="Impressum" visible={this.visible}>{this.impressum}</shellnuts-modal>
      </Fragment>
    );
  }


  impressum = (<div style={{'color': 'black', 'margin': '0 10px'}}>
    <h1>Impressum</h1>
    <p>Angaben gemäß § 5 TMG</p>
    <p>Tim Seyschab <br/>
      Wiesenstraße 9<br/>
      90443 Nürnberg <br/>
    </p>
    <p><strong>Vertreten durch: </strong><br/>
      Tim Seyschab<br/>
    </p>
    <p><strong>Kontakt:</strong><br/>
      E-Mail: <a href='mailto:webadmin@shellnuts.de'>webadmin@shellnuts.de</a><br/></p>
    <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br/>
      Tim Seyschab <br/>
      Wiesenstraße 9<br/>
      90443 Nürnberg <br/></p>
    <p><strong>Haftungsausschluss: </strong><br/><br/><strong>Haftung für Links</strong><br/><br/>
      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
      Deshalb
      können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
      stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum
      Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt
      der
      Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
      konkrete
      Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
      derartige Links umgehend entfernen.
    </p>
  </div>)
}
