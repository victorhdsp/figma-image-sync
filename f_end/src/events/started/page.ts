export async function create_or_set_page(pluginId: string) {
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    let page = pages.find((page) => page.name === pluginId);
    if (!page) {
      page = figma.createPage();
      page.name = pluginId;
    }
    return page;
  }