import {newSpecPage} from '@stencil/core/testing';
import {ShellnutsFooter} from './shellnuts-footer';

describe('shellnuts-footer', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [ShellnutsFooter],
      html: '<shellnuts-footer></shellnuts-footer>'
    });
    expect(root).toMatchSnapshot();
  });
});
