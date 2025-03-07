import $ from "jquery";

interface LayoutOptions {
  maxRatio: number;
  minRatio: number;
  fixedRatio: boolean;
  animate: boolean | { duration?: number; easing?: string; complete?: () => void };
  bigClass: string;
  bigPercentage: number;
  bigFixedRatio: boolean;
  bigMaxRatio: number;
  bigMinRatio: number;
  bigFirst: boolean;
}

interface DimensionCalculation {
  maxArea: number;
  targetCols: number;
  targetRows: number;
  targetHeight: number;
  targetWidth: number;
  ratio: number;
}

interface RowInfo {
  children: HTMLElement[];
  width: number;
  height: number;
}

class OpenViduLayout {
  private layoutContainer: HTMLElement | null = null;
  private opts!: LayoutOptions;

  //추후 width 사용 시 위 처럼 사용
  // private fixAspectRatio(elem: HTMLElement, width: number): void {
  // private fixAspectRatio(elem: HTMLElement): void {
  //   const sub = elem.querySelector(".OT_root");
  //   console.log(sub);
  //   // if (sub) {
  //   //   // If this is the parent of a subscriber or publisher then we need
  //   //   // to force the mutation observer on the publisher or subscriber to
  //   //   // trigger to get it to fix it's layout
  //   //   const oldWidth = sub.style.width;
  //   //   sub.style.width = width + "px";
  //   //   sub.style.width = oldWidth || "";
  //   // }
  // }

  private positionElement() // elem: HTMLElement,
  // x: number,
  // y: number,
  // width: number,
  // height: number
  // animate: boolean | { duration?: number; easing?: string; complete?: () => void }
  : void {
    // const targetPosition = {
    //   left: x + "px",
    //   top: y + "px",
    //   width: width + "px",
    //   height: height + "px",
    // };
    // this.fixAspectRatio(elem, width);
    // if (animate && $) {
    //   $(elem).stop();
    //   $(elem).animate(targetPosition, animate.duration || 200, animate.easing || "swing", () => {
    //     this.fixAspectRatio(elem, width);
    //     if (animate && typeof animate !== "boolean" && animate.complete) {
    //       animate.complete.call(this);
    //     }
    //   });
    // } else {
    //   $(elem).css(targetPosition);
    // }
    // this.fixAspectRatio(elem, width);
  }

  private getVideoRatio(elem: HTMLElement | null): number {
    if (!elem) {
      return 3 / 4;
    }
    const video = elem.querySelector("video");
    if (video && video.videoHeight && video.videoWidth) {
      return video.videoHeight / video.videoWidth;
    } else if ((elem as any).videoHeight && (elem as any).videoWidth) {
      return (elem as any).videoHeight / (elem as any).videoWidth;
    }
    return 3 / 4;
  }

  private getCSSNumber(elem: HTMLElement, prop: string): number {
    const cssStr = $(elem).css(prop);
    return cssStr ? parseInt(cssStr, 10) : 0;
  }

  private cheapUUID(): string {
    return (Math.random() * 100000000).toFixed(0);
  }

  private getHeight(elem: HTMLElement): number {
    const heightStr = $(elem).css("height");
    return heightStr ? parseInt(heightStr, 10) : 0;
  }

  private getWidth(elem: HTMLElement): number {
    const widthStr = $(elem).css("width");
    return widthStr ? parseInt(widthStr, 10) : 0;
  }

  private getBestDimensions(
    minRatio: number,
    maxRatio: number,
    count: number,
    WIDTH: number,
    HEIGHT: number,
    targetHeight: number
  ): DimensionCalculation {
    let maxArea: number = 0;
    let targetCols: number = 1;
    let targetRows: number = 1;
    let targetWidth: number = 0;
    let tWidth: number = 0;
    let tHeight: number = 0;
    let tRatio: number = 0;

    // Iterate through every possible combination of rows and columns
    // and see which one has the least amount of whitespace
    for (let i = 1; i <= count; i++) {
      const colsAux = i;
      const rowsAux = Math.ceil(count / colsAux);

      // Try taking up the whole height and width
      tHeight = Math.floor(HEIGHT / rowsAux);
      tWidth = Math.floor(WIDTH / colsAux);

      tRatio = tHeight / tWidth;
      if (tRatio > maxRatio) {
        // We went over decrease the height
        tRatio = maxRatio;
        tHeight = tWidth * tRatio;
      } else if (tRatio < minRatio) {
        // We went under decrease the width
        tRatio = minRatio;
        tWidth = tHeight / tRatio;
      }

      const area = tWidth * tHeight * count;

      // If this width and height takes up the most space then we're going with that
      if (maxArea === undefined || area > maxArea) {
        maxArea = area;
        targetHeight = tHeight;
        targetWidth = tWidth;
        targetCols = colsAux;
        targetRows = rowsAux;
      }
    }

    return {
      maxArea,
      targetCols,
      targetRows,
      targetHeight,
      targetWidth,
      ratio: targetHeight / targetWidth,
    };
  }

  private arrange(
    children: HTMLElement[],
    WIDTH: number,
    HEIGHT: number,
    offsetLeft: number,
    offsetTop: number,
    fixedRatio: boolean,
    minRatio: number,
    maxRatio: number,
    animate: boolean | { duration?: number; easing?: string; complete?: () => void }
  ): void {
    //미사용 변수 없애기 위한 console.log
    console.log(children, WIDTH, HEIGHT, offsetLeft, offsetTop, fixedRatio, minRatio, maxRatio, animate);

    let targetHeight: number = 0;
    const count = children.length;
    let dimensions: DimensionCalculation;

    if (!fixedRatio) {
      dimensions = this.getBestDimensions(minRatio, maxRatio, count, WIDTH, HEIGHT, targetHeight);
    } else {
      // Use the ratio of the first video element we find to approximate
      const ratio = this.getVideoRatio(children.length > 0 ? children[0] : null);
      dimensions = this.getBestDimensions(ratio, ratio, count, WIDTH, HEIGHT, targetHeight);
    }

    // Loop through each stream in the container and place it inside
    let x = 0;
    let y = 0;
    const rows: RowInfo[] = [];
    let row: RowInfo | null = null;

    // Iterate through the children and create an array with a new item for each row
    // and calculate the width of each row so that we know if we go over the size and need
    // to adjust
    for (let i = 0; i < children.length; i++) {
      if (i % dimensions.targetCols === 0) {
        // This is a new row
        row = {
          children: [],
          width: 0,
          height: 0,
        };
        rows.push(row);
      }
      const elem = children[i];
      if (row) {
        row.children.push(elem);
        let targetWidth = dimensions.targetWidth;
        targetHeight = dimensions.targetHeight;
        // If we're using a fixedRatio then we need to set the correct ratio for this element
        if (fixedRatio) {
          targetWidth = targetHeight / this.getVideoRatio(elem);
        }
        row.width += targetWidth;
        row.height = targetHeight;
      }
    }

    // Calculate total row height adjusting if we go too wide
    let totalRowHeight = 0;
    let remainingShortRows = 0;
    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      if (row.width > WIDTH) {
        // Went over on the width, need to adjust the height proportionally
        row.height = Math.floor(row.height * (WIDTH / row.width));
        row.width = WIDTH;
      } else if (row.width < WIDTH) {
        remainingShortRows += 1;
      }
      totalRowHeight += row.height;
    }

    if (totalRowHeight < HEIGHT && remainingShortRows > 0) {
      // We can grow some of the rows, we're not taking up the whole height
      let remainingHeightDiff = HEIGHT - totalRowHeight;
      totalRowHeight = 0;
      for (let i = 0; i < rows.length; i++) {
        row = rows[i];
        if (row.width < WIDTH) {
          // Evenly distribute the extra height between the short rows
          let extraHeight = remainingHeightDiff / remainingShortRows;
          if (extraHeight / row.height > (WIDTH - row.width) / row.width) {
            // We can't go that big or we'll go too wide
            extraHeight = Math.floor(((WIDTH - row.width) / row.width) * row.height);
          }
          row.width += Math.floor((extraHeight / row.height) * row.width);
          row.height += extraHeight;
          remainingHeightDiff -= extraHeight;
          remainingShortRows -= 1;
        }
        totalRowHeight += row.height;
      }
    }

    // vertical centering
    y = (HEIGHT - totalRowHeight) / 2;

    // Iterate through each row and place each child
    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      // center the row
      const rowMarginLeft = (WIDTH - row.width) / 2;
      x = rowMarginLeft;
      for (let j = 0; j < row.children.length; j++) {
        const elem = row.children[j];

        let targetWidth = dimensions.targetWidth;
        targetHeight = row.height;
        // If we're using a fixedRatio then we need to set the correct ratio for this element
        if (fixedRatio) {
          targetWidth = Math.floor(targetHeight / this.getVideoRatio(elem));
        }
        elem.style.position = "absolute";
        const actualWidth =
          targetWidth -
          this.getCSSNumber(elem, "paddingLeft") -
          this.getCSSNumber(elem, "paddingRight") -
          this.getCSSNumber(elem, "marginLeft") -
          this.getCSSNumber(elem, "marginRight") -
          this.getCSSNumber(elem, "borderLeft") -
          this.getCSSNumber(elem, "borderRight");

        const actualHeight =
          targetHeight -
          this.getCSSNumber(elem, "paddingTop") -
          this.getCSSNumber(elem, "paddingBottom") -
          this.getCSSNumber(elem, "marginTop") -
          this.getCSSNumber(elem, "marginBottom") -
          this.getCSSNumber(elem, "borderTop") -
          this.getCSSNumber(elem, "borderBottom");

        // this.positionElement(elem, x + offsetLeft, y + offsetTop, actualWidth, actualHeight, animate);
        this.positionElement();
        //미사용 변수 없애기 위한 console.log
        console.log(x, y, actualWidth, actualHeight);
        x += targetWidth;
      }
      y += targetHeight;
    }
  }

  private filterDisplayNone(element: HTMLElement): boolean {
    return element.style.display !== "none";
  }

  public updateLayout(): void {
    if (!this.layoutContainer || this.layoutContainer.style.display === "none") {
      return;
    }
    let id = this.layoutContainer.id;
    if (!id) {
      id = "OT_" + this.cheapUUID();
      this.layoutContainer.id = id;
    }

    const HEIGHT =
      this.getHeight(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, "borderTop") -
      this.getCSSNumber(this.layoutContainer, "borderBottom");
    const WIDTH =
      this.getWidth(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, "borderLeft") -
      this.getCSSNumber(this.layoutContainer, "borderRight");

    const availableRatio = HEIGHT / WIDTH;

    let offsetLeft = 0;
    let offsetTop = 0;
    let bigOffsetTop = 0;
    let bigOffsetLeft = 0;

    const bigOnes = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll("#" + id + ">." + this.opts.bigClass),
      this.filterDisplayNone
    ) as HTMLElement[];

    const smallOnes = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll("#" + id + ">*:not(." + this.opts.bigClass + ")"),
      this.filterDisplayNone
    ) as HTMLElement[];

    if (bigOnes.length > 0 && smallOnes.length > 0) {
      let bigWidth: number, bigHeight: number;

      if (availableRatio > this.getVideoRatio(bigOnes[0])) {
        // We are tall, going to take up the whole width and arrange small
        // guys at the bottom
        bigWidth = WIDTH;
        bigHeight = Math.floor(HEIGHT * this.opts.bigPercentage);
        offsetTop = bigHeight;
        bigOffsetTop = HEIGHT - offsetTop;
      } else {
        // We are wide, going to take up the whole height and arrange the small
        // guys on the right
        bigHeight = HEIGHT;
        bigWidth = Math.floor(WIDTH * this.opts.bigPercentage);
        offsetLeft = bigWidth;
        bigOffsetLeft = WIDTH - offsetLeft;
      }
      if (this.opts.bigFirst) {
        this.arrange(
          bigOnes,
          bigWidth,
          bigHeight,
          0,
          0,
          this.opts.bigFixedRatio,
          this.opts.bigMinRatio,
          this.opts.bigMaxRatio,
          this.opts.animate
        );
        this.arrange(
          smallOnes,
          WIDTH - offsetLeft,
          HEIGHT - offsetTop,
          offsetLeft,
          offsetTop,
          this.opts.fixedRatio,
          this.opts.minRatio,
          this.opts.maxRatio,
          this.opts.animate
        );
      } else {
        this.arrange(
          smallOnes,
          WIDTH - offsetLeft,
          HEIGHT - offsetTop,
          0,
          0,
          this.opts.fixedRatio,
          this.opts.minRatio,
          this.opts.maxRatio,
          this.opts.animate
        );
        this.arrange(
          bigOnes,
          bigWidth,
          bigHeight,
          bigOffsetLeft,
          bigOffsetTop,
          this.opts.bigFixedRatio,
          this.opts.bigMinRatio,
          this.opts.bigMaxRatio,
          this.opts.animate
        );
      }
    } else if (bigOnes.length > 0 && smallOnes.length === 0) {
      this
        // We only have one bigOne just center it
        .arrange(
          bigOnes,
          WIDTH,
          HEIGHT,
          0,
          0,
          this.opts.bigFixedRatio,
          this.opts.bigMinRatio,
          this.opts.bigMaxRatio,
          this.opts.animate
        );
    } else {
      this.arrange(
        smallOnes,
        WIDTH - offsetLeft,
        HEIGHT - offsetTop,
        offsetLeft,
        offsetTop,
        this.opts.fixedRatio,
        this.opts.minRatio,
        this.opts.maxRatio,
        this.opts.animate
      );
    }
  }

  public initLayoutContainer(container: HTMLElement | string, opts: Partial<LayoutOptions>): void {
    this.opts = {
      maxRatio: opts.maxRatio != null ? opts.maxRatio : 3 / 2,
      minRatio: opts.minRatio != null ? opts.minRatio : 9 / 16,
      fixedRatio: opts.fixedRatio != null ? opts.fixedRatio : false,
      animate: opts.animate != null ? opts.animate : false,
      bigClass: opts.bigClass != null ? opts.bigClass : "OT_big",
      bigPercentage: opts.bigPercentage != null ? opts.bigPercentage : 0.8,
      bigFixedRatio: opts.bigFixedRatio != null ? opts.bigFixedRatio : false,
      bigMaxRatio: opts.bigMaxRatio != null ? opts.bigMaxRatio : 3 / 2,
      bigMinRatio: opts.bigMinRatio != null ? opts.bigMinRatio : 9 / 16,
      bigFirst: opts.bigFirst != null ? opts.bigFirst : true,
    };
    this.layoutContainer = typeof container === "string" ? document.querySelector(container) : container;
  }

  public setLayoutOptions(options: Partial<LayoutOptions>): void {
    this.opts = { ...this.opts, ...options };
  }
}

export default OpenViduLayout;
