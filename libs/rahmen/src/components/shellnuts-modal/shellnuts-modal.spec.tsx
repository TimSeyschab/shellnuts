import { newSpecPage } from '@stencil/core/testing';
import { ShellnutsModal } from './shellnuts-modal';

describe('shellnuts-modal', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [ShellnutsModal],
      html: '<shellnuts-modal></shellnuts-modal>'
    });
    expect(root).toEqualHtml(`
      <shellnuts-modal>
        <mock:shadow-root>
            <div class='wrapper'>
              <div class='modal'>
                <span class='title'></span>
                <div class='content'>
                  <slot/>
                </div>
                <div class='button-container'>
                  <button class='ok'>Okay</button>
                </div>
              </div>
            </div>
        </mock:shadow-root>
      </shellnuts-modal>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [ShellnutsModal],
      html: `<shellnuts-modal title="Test title" visible><p>Dies ist ein Test</p></shellnuts-modal>`
    });
    expect(root).toMatchSnapshot();
  });
});
