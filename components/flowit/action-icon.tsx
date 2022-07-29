import { Component, useEffect, useState } from "react";
import { NodeType } from "@/entities/Node";
import {BsCircle, BsCircleFill, BsQuestionCircleFill, BsQuestionDiamond} from "react-icons/bs"
import {BiRectangle, BiCodeBlock} from "react-icons/bi"
import {TiArrowLoop} from "react-icons/ti"

export interface IActionIconProps{
    type: NodeType;
}

export default function ActionIcon(props:IActionIconProps&React.HTMLAttributes<HTMLDivElement>) {
    const [icon, setIcon] = useState<JSX.Element>(<BsQuestionCircleFill size={24} />);

    useEffect(() => {
        switch(props.type) {
            case NodeType.Start: {
                setIcon(<BsCircle size={24} className={props.className} />);
                break;
            }
            case NodeType.End: {
                setIcon(<BsCircleFill size={24} className={props.className} />);
                break;
            }
            case NodeType.Condition: {
                setIcon(<BsQuestionDiamond size={24} className={props.className} />);
                break;
            }
            case NodeType.Operation: {
                setIcon(<BiRectangle size={24} className={props.className} />);
                break;
            }
            case NodeType.Loop: {
                setIcon(<TiArrowLoop size={24} className={props.className} />);
                break;
            }
            case NodeType.Subroutine: {
                setIcon(<BiCodeBlock size={24} className={props.className} />);
                break;
            }
        }
    }, [props.type]);


    return (icon);
}