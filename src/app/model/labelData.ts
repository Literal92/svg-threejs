export interface LabelData {
    data: {
        id: string;
        shape: {
            elementId: string;
            shape: string;
            view: {
                fill: string;
                width: number;
                height: number;
            };
        };
        text: {
            elementId: string;
            view: {
                'font-size': number;
                fill: string;
                x: number;
                y: number;
            };
            content: {
                label: string;
                dynamic: {
                    topic: string;
                    output: string;
                    isLinked: boolean;
                };
            };
        };
        action: {
            type: string | null;
        };
        animation: {
            type: string | null;
        };
        type: string;
    };
}

export interface LabelConfig {
    labelText: string,
    labelSize: number,
    labelColor: string,
    labelx: number,
    labelY: number,
}

export interface ShapeConfig {
    name: string,
    fill: string,
    width: number,
    height: number,
}