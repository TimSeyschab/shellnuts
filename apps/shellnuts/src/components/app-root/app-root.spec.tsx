import {newSpecPage} from '@stencil/core/testing';
import {AppRoot} from "./app-root";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import {ShellnutsFooter, ShellnutsModal, ShellnutsHeader} from "@shellnuts/rahmen";

describe('app-root', () => {

  it('renders with footer and modal', async () => {
    const page = await newSpecPage({
      components: [AppRoot, ShellnutsFooter, ShellnutsModal],
      html: `<app-root></app-root>`
    });

    expect(page.root).toMatchSnapshot()
  });

  it('renders with header', async () => {
    const page = await newSpecPage({
      components: [AppRoot, ShellnutsHeader],
      html: `<app-root></app-root>`
    });

    expect(page.root).toMatchSnapshot()
  });
});
