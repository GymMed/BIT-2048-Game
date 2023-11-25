class GameAnimationAttachmentsManager {
    constructor() {}

    attachAnimation(dom, animationAttachment) {
        if (!(animationAttachment instanceof GameAnimationAttachment)) {
            console.log("We encountered a problem! please start a new game!");
        }

        if (!Array.isArray(dom.animationAttachments))
            dom.animationAttachments = [];

        if (
            dom.animationAttachments.length > 0 ||
            dom.style.animationName !== ""
        ) {
            dom.animationAttachments.push(animationAttachment);
            return;
        }

        this.attachAnimationToDom(dom, animationAttachment);
    }

    startAttachedAnimation(dom) {
        if (
            !Array.isArray(dom.animationAttachments) ||
            dom.animationAttachments.length < 1 ||
            !(dom.animationAttachments[0] instanceof GameAnimationAttachment)
        )
            return;

        this.attachAnimationToDom(dom, dom.animationAttachments[0]);
        dom.animationAttachments.shift();
    }

    attachAnimationToDom(dom, animationAttachment) {
        if (!(animationAttachment instanceof GameAnimationAttachment)) return;

        dom.style.animationName = animationAttachment.getAnimationName();
        dom.style.animationDuration =
            animationAttachment.getAnimationDuration();
    }
}
