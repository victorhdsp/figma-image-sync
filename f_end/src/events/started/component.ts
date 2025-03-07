import { IImageInfo } from "../../utils/google";

export async function createComponent(page: PageNode, imageInfo: IImageInfo) {
  let x = 0;
  let deepRightNode: SceneNode | undefined;

  if (page.children.length > 0) {
    deepRightNode = page.children[0];
    page.children.forEach((node) => {
      if (node.x > deepRightNode!.x)
        deepRightNode = node;
    });
    x = deepRightNode.x + deepRightNode.width + 200;
  }

  const fComp = figma.createComponent();
  fComp.name = `${imageInfo.name}_|_${imageInfo.modifiedTime}`;
  fComp.x = x;
  return fComp;
}

export async function getComponent(page: PageNode, imageInfo: IImageInfo): Promise<ComponentNode | null> {
  const fComp = page.findOne((node) => node.name === `${imageInfo.name}_|_${imageInfo.modifiedTime}`);
  return fComp as ComponentNode | null;
}

export async function componentNeedUpdate(fComp: ComponentNode, imageInfo: IImageInfo): Promise<boolean> {
  const name = fComp.name.split("_|_")[0];
  const modifiedTime = fComp.name.split("_|_")[1];
  if (name === imageInfo.name && modifiedTime === imageInfo.modifiedTime) {
    console.log("component is up to date");
    return false;
  }
  console.log("component need update");
  return true;
}

export async function setImageInComponent(fComp: ComponentNode, base64: Uint8Array) {
  const fImage = figma.createImage(base64);
  const { width, height } = await fImage.getSizeAsync();
  fComp.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: fImage.hash }];
  fComp.resize(width, height);
}