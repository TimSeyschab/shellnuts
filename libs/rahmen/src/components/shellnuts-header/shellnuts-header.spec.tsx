import { newSpecPage } from '@stencil/core/testing';
import { ShellnutsHeader } from './shellnuts-header';

describe('shellnuts-header', () => {
  it('renders with default values', async () => {
    const {root} = await newSpecPage({
      components: [ShellnutsHeader],
      html: '<shellnuts-header default></shellnuts-headerdefault>'
    });
    expect(root).toMatchSnapshot();
  });

  it('renders with provided values', async () => {
    const headerProp = {
      urlList: [
        {
          url: "/index.html",
          shortName: "In",
          longName: "Index"
        },
        {
          url: "/path/to/page.html",
          shortName: "Pg",
          longName: "Page"
        }
      ]
    }

    const page = await newSpecPage({
      components: [ShellnutsHeader],
      html: `<div></div>`
    });

    let component = page.doc.createElement("shellnuts-header");
    (component as any).headerProp = headerProp;
    page.root.appendChild(component);
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot()
  });
});
