import * as React from 'react';
export default class Wave extends React.Component<{
    insertExtraNode?: boolean;
}> {
    private instance?;
    private extraNode;
    private clickWaveTimeoutId;
    isNotGrey(color: string): boolean;
    onClick: (node: HTMLElement, waveColor: string) => void;
    bindAnimationEvent: (node: HTMLElement) => {
        cancel: () => void;
    } | undefined;
    getAttributeName(): "ant-click-animating" | "ant-click-animating-without-extra-node";
    resetEffect(node: HTMLElement): void;
    onTransitionEnd: (e: AnimationEvent) => void;
    removeExtraStyleNode(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
