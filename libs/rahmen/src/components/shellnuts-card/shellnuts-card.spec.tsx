import { newSpecPage } from '@stencil/core/testing';
import { ShellnutsCard } from './shellnuts-card';

describe('shellnuts-card', () => {

  it('renders with provided values', async () => {
    const cardProp = {
      titel: 'Titel für den Test',
      author: 'Testuser',
      text: ['Dies ist ein Test', 'des Card Modules']
    }

    const page = await newSpecPage({
      components: [ShellnutsCard],
      html: `<div></div>`
    });

    let component = page.doc.createElement("shellnuts-card");
    (component as any).cardProp = cardProp;
    page.root.appendChild(component);
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot()
  });

});
