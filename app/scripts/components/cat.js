import EyeFollowAnimation from '~/components/animation/followEye';

export default class ImageAnimation {
    constructor() {
        this.element = document.getElementById('animation-main');
        this.interactives = {
            eyes: {
                left: new EyeFollowAnimation('eye-left', this.element),
                right: new EyeFollowAnimation('eye-right', this.element),
            },
        };

        this.scale = 1;
        this.animationFrame = false;

        this.board = {
            height: 0,
            width: 0,
        };

        // size: width,height
        // type: rect, circle
        this.deadZone = {
            centerX: 0,
            centerY: 0,
            height: 0,
            type: 'rect',
            width: 0,
            x: 0,
            y: 0,
        };

        setTimeout(() => {
            this.setPosValues();
            this.initLooks();
            this.startFrames();
        }, 17);

        // this.readPaths();
    }

    /**
     * Set and display path's stroke-dasharray and dash-offset values for animations
     */
    readPaths() {
        const lines = document.getElementById('faceBottom');
        const output = document.getElementById('pathStroke');

        for (const line of lines.childNodes) {
            line.strokeDasharray = line.getTotalLength();
            line.strokeDashoffset = line.getTotalLength();
            line.setAttribute('stroke-dasharray', line.getTotalLength().toFixed(2));
            line.setAttribute('stroke-dashoffset', line.getTotalLength().toFixed(2));

            output.innerText += line.outerHTML;
            output.innerHTML += '<br>';
        }
    }

    /**
     * Pre-calculate board and screen sizes for interactive animations
     */
    setPosValues() {
        this.board.width = this.element.parentElement.offsetWidth;
        this.board.height = this.element.parentElement.offsetHeight;

        // svg comapred to screen size
        this.scale = this.element.viewBox.baseVal.width / this.element.parentElement.offsetWidth;

        // deadzone values: area between the eyes
        const leftBounds = this.interactives.eyes.left.eye.getBBox();
        const rightBounds = this.interactives.eyes.right.eye.getBBox();

        // deadzone center: relative point between the eyes
        this.deadZone.centerX = (rightBounds.x - leftBounds.x - leftBounds.width) / 2 + leftBounds.x + leftBounds.width;
        this.deadZone.centerY = (Math.min(leftBounds.y, rightBounds.y) + Math.max(leftBounds.y + leftBounds.height, rightBounds.y + rightBounds.height)) / 2;

        this.deadZone.x = this.deadZone.centerX - this.deadZone.width / 2;
        this.deadZone.y = this.deadZone.centerY - this.deadZone.height / 2;
    }

    /**
     * Run intro animations
     */
    initLooks() {
        // initAnim triggers css keyframes, that run for 4s (3s + 1s delay)
        this.element.classList.add('initAnim');
        this.animateEyesIntro();

        this.element.addEventListener('click', this.getPos.bind(this));

        setTimeout(() => {
            this.element.classList.add('initAnimEnd');

            // init user interactions after intro finishes
            // this.interactives.follow.eyeLeft.runFollow();
            this.element.addEventListener('mousemove', this.animateEyesFollow.bind(this));
            this.element.addEventListener('mouseout', this.animateEyesReset.bind(this));

            this.animateEyesBlink();

            // trigger global animation chain
            // ToDo: little readability conflict with id/class names
            document.getElementById('initAnim').beginElement();
            // thats mostly SVG <anim> chained

        }, 4000);
    }

    /**
     * Display debugging positions on screen
     *
     * @param event
     */
    getPos(event) {
        console.log(this.scale);
        console.log(event.offsetX);
        console.log(event.offsetY);
        console.log(event.offsetX * this.scale);
        console.log(event.offsetY * this.scale);

        console.log(event.target.getBBox());
        console.log(event.target.tagName);
        if (event.target.tagName === 'path' || event.target.tagName === 'line') {
            console.log(event.target.getTotalLength());
        }
    }

    /**
     * Calculates mouse coordinates for transformations
     *
     * @param event
     * @param reset
     */
    animateEyesFollow(event, reset = false) {
        if (reset) {
            this.triggerInteractive('setTransformReset');

            return;
        }

        const screenCenterX = this.deadZone.centerX / this.scale;
        const screenCenterY = this.deadZone.centerY / this.scale;
        const coordSet = {
            // position from center, relative to SVG size
            cx: event.offsetX * this.scale - this.deadZone.centerX,
            cy: event.offsetY * this.scale - this.deadZone.centerY,
            // position from center proportional to area size
            relx: 0,
            rely: 0,
            reset,
            // position from topleft(0), relative to SVG size
            x: event.offsetX * this.scale,
            y: event.offsetY * this.scale,
        };

        if (event.offsetX > screenCenterX) {
            coordSet.relx = (event.offsetX - screenCenterX) / (this.board.width - screenCenterX);
        } else {
            coordSet.relx = event.offsetX / screenCenterX;
        }

        if (event.offsetY > screenCenterY) {
            coordSet.rely = (event.offsetY - screenCenterY) / (this.board.height - screenCenterY);
        } else {
            coordSet.rely = event.offsetY / screenCenterY;
        }

        // pass mouse position relative to SVG to eyes to position them
        if (!reset) {
            this.triggerInteractive('setTransformTarget', [coordSet]);
        }
    }

    /**
     * Resets animations if mouse is moved out of screen area
     *
     * @param event
     */
    animateEyesReset(event) {
        this.animateEyesFollow(event, true);
    }


    /**
     * Intro animations
     */
    animateEyesIntro() {
        // timers:
        // eye opening is handled by CSS keyframes
        setTimeout(() => {
            // flow left
            const coordSetLeft = {
                cx: -1,
                cy: -1,
                relx: 0.05,
                rely: 1,
            };

            this.triggerInteractive('setTransformTarget', [coordSetLeft]);

            setTimeout(() => {
                const coordSetRight = {
                    cx: 1,
                    cy: -1,
                    relx: 0.95,
                    rely: 1,
                };

                this.triggerInteractive('setTransformTarget', [coordSetRight]);

                setTimeout(() => {
                    this.triggerInteractive('setTransformReset');
                }, 1400);
            }, 1400);
        }, 1000);
    }

    /**
     * Randomized continious blinking animation
     */
    animateEyesBlink() {
        const timeout = Math.floor(Math.random() * 6 + 4);
        let double = false;

        if (timeout === 9 && Math.random() > 0.5) {
            double = true;
        }

        setTimeout(() => {
            this.triggerInteractive('doBlink');
            if (double) {
                setTimeout(() => {
                    this.triggerInteractive('doBlink');
                }, 180);
            }

            this.animateEyesBlink();
        }, timeout * 1000);
    }

    /**
     * Run given function(animation) for each defined animation element
     *
     * @param callback Function to call
     * @param params Params for given function
     */
    triggerInteractive(callback, params) {
        for (const followAnim in this.interactives.eyes) {
            if (this.interactives.eyes.hasOwnProperty(followAnim)) {
                this.interactives.eyes[followAnim].triggerInteractive(callback, params);
            }
        }
    }

    startFrames() {
        this.triggerInteractive('runFollowFrame');

        requestAnimationFrame(this.startFrames.bind(this));
    }

    stopFrames() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}
