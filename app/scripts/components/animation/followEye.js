export default class EyeFollowAnimation {
    constructor(target, root) {
        this.rootSvg = root;
        this.eye = document.getElementById(target);
        this.eyeCore = document.getElementById(target + '-core');
        this.eyeIris = document.getElementById(target + '-iris');
        this.eyeLens = document.getElementById(target + '-lens');
        this.eyeLight = document.getElementById(target + '-light');
        this.eyeMask = document.getElementById(target + '-mask');
        this.running = false;

        this.viewBox = {
            center: { x: 0, y: 0 },
            limitBottom: { x: 0, y: 0 },
            limitTop: { x: 0, y: 0 },
            origin: { x: 0, y: 0 },
        };

        // precalculated amounts for allowed min/max transforms
        this.transformLimits = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
        };

        /**
         * Frame animation movement coefficent
         *
         * @type {{x: number, y: number}}
         */
        this.frameCoeff = {
            x: 0.15,
            y: 0.15,
        };

        // endpositions for frame based animatons
        this.frameTarget = {
            iris: {
                x: 0,
                y: 0,
            },
            lens: {
                x: 0,
                y: 0,
            },
            light: {
                x: 0,
                y: 0,
            },
        };

        this.framePos = {
            iris: {
                x: 0,
                y: 0,
            },
            lens: {
                x: 0,
                y: 0,
            },
            light: {
                x: 0,
                y: 0,
            },
        };

        this.initPosValues();
        this.initTransforms();
        this.runAnimation();
    }

    runAnimation() {
        this.running = true;
    }

    stopAnimation() {
        this.running = false;
    }

    initPosValues() {
        const bounds = this.eyeCore.getBBox();
        const irisSize = this.eyeIris.getBBox();
        const lensSize = this.eyeLens.getBBox();

        // element starting point
        this.viewBox.origin.x = irisSize.x;
        this.viewBox.origin.y = irisSize.y;

        this.viewBox.center.x = irisSize.x + irisSize.width / 2;
        this.viewBox.center.y = irisSize.y + irisSize.height / 2;

        // left/right movement is limited to iris edges + qt the space to lens
        // lens will get additionaly moved for displaying depth
        const xLeft = irisSize.x - bounds.x + 2;
        const xRight = bounds.x + bounds.width - irisSize.x - irisSize.width + 2;

        // top/bottom movement is limited to iris edges
        const yUp = irisSize.y + irisSize.height - bounds.y - bounds.height;
        const yDown = bounds.y - irisSize.y;

        this.transformLimits.top = yUp;
        this.transformLimits.bottom = yDown;
        this.transformLimits.left = xLeft;
        this.transformLimits.right = xRight;

        // this.viewBox.limitTop.x;
        // this.viewBox.limitTop.y;
    }

    initTransforms() {
        this.setBaseTransform(this.eyeIris);
        this.setBaseTransform(this.eyeLens);
        this.setBaseTransform(this.eyeLight);
    }

    /**
     * Create base transform object form animated objects
     *
     * @param item
     */
    setBaseTransform(item) {
        const transform = this.rootSvg.createSVGTransform();

        transform.setTranslate(0, 0);

        item.transform.baseVal.appendItem(transform);
    }

    setTransformTarget(coords) {
        let targetx = this.transformLimits.left;
        let targety = this.transformLimits.top;

        if (coords.cx > 0) {
            targetx = this.transformLimits.right * coords.relx;
        } else {
            targetx = this.transformLimits.left * coords.relx - this.transformLimits.left;
        }

        if (coords.cy > 0) {
            targety = this.transformLimits.top * coords.rely;
        } else {
            targety = this.transformLimits.bottom * coords.rely - this.transformLimits.bottom;
        }

        /*
        this.setTransformObject(this.eyeIris, targetx, targety * 2);
        this.setTransformObject(this.eyeLens, targetx * 1.4, targety * 2);
        this.setTransformObject(this.eyeLight, targetx * -0.1, 0);
         */

        this.frameTarget.iris.x = targetx;
        this.frameTarget.iris.y = targety * 2;
        this.frameTarget.lens.x = targetx * 1.4;
        this.frameTarget.lens.y = targety * 2;
        this.frameTarget.light.x = targetx * -0.1;
        this.frameTarget.light.y = 0;
    }

    /**
     * Resets transformations to original positions
     *
     * @param event
     */
    setTransformReset(event) {
        // this.setTransformObject(this.eyeIris, 0, 0);
        // this.setTransformObject(this.eyeLens, 0, 0);
        // this.setTransformObject(this.eyeLight, 0, 0);

        this.frameTarget.iris.x = 0;
        this.frameTarget.iris.y = 0;
        this.frameTarget.lens.x = 0;
        this.frameTarget.lens.y = 0;
        this.frameTarget.light.x = 0;
        this.frameTarget.light.y = 0;
    }

    /**
     * Set transformation values for given element
     *
     * @param item
     * @param x
     * @param y
     */
    setTransformObject(item, x, y) {
        const transformBase = item.transform.baseVal;
        const transform = transformBase.getItem(0);

        transform.setTranslate(x, y);
    }

    /**
     * Trigger a single blink animation, close to open
     */
    doBlink() {
        this.eyeMask.classList.add('close');

        this.eyeMask.getElementsByTagName('g')[0].addEventListener('transitionend', (event) => {
            setTimeout(() => {
                this.eyeMask.classList.remove('close');
            }, 20);
        }, { once: true });
    }

    triggerInteractive(callback, params) {
        if (this.running) {
            if (params) {
                this[callback](...params);
            } else {
                this[callback]();
            }
        }
    }

    /**
     * Animate follow frame
     */
    runFollowFrame() {
        // get current pos
        this.framePos.iris.x += (this.frameTarget.iris.x - this.framePos.iris.x) * this.frameCoeff.x;
        this.framePos.iris.y += (this.frameTarget.iris.y - this.framePos.iris.y) * this.frameCoeff.y;
        this.framePos.lens.x += (this.frameTarget.lens.x - this.framePos.lens.x) * this.frameCoeff.x;
        this.framePos.lens.y += (this.frameTarget.lens.y - this.framePos.lens.y) * this.frameCoeff.y;
        this.framePos.light.x += (this.frameTarget.light.x - this.framePos.light.x) * this.frameCoeff.x;
        this.framePos.light.y += (this.frameTarget.light.y - this.framePos.light.y) * this.frameCoeff.y;

        // move relative to pos
        this.setTransformObject(this.eyeIris, this.framePos.iris.x, this.framePos.iris.y);
        this.setTransformObject(this.eyeLens, this.framePos.lens.x, this.framePos.lens.y);
        this.setTransformObject(this.eyeLight, this.framePos.light.x, this.framePos.light.y);
    }
}
