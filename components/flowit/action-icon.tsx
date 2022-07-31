import { Component, useEffect, useState } from "react";
import { NodeType } from "@/entities/Node";
import {BsCircle, BsCircleFill, BsQuestionCircleFill, BsQuestionDiamond, BsBoxArrowInRight, BsBoxArrowRight} from "react-icons/bs"
import {FiArrowLeft} from "react-icons/fi"
import {TiArrowLoop} from "react-icons/ti"
import {TbVariable} from "react-icons/tb"
import {AiOutlineExport} from "react-icons/ai"
import {MdInput} from "react-icons/md"

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
            case NodeType.Input: {
                setIcon(<MdInput size={24} className={props.className} />);
                break;
            }
            case NodeType.Output: {
                setIcon(<AiOutlineExport size={24} className={props.className} />);
                break;
            }
            case NodeType.Loop: {
                setIcon(<TiArrowLoop size={24} className={props.className} />);
                break;
            }
            case NodeType.Asignment: {
                setIcon(<FiArrowLeft size={24} className={props.className} />);
                break;
            }
            case NodeType.Declaration: {
                setIcon(<TbVariable size={24} className={props.className} />);
                break;
            }
        }
    }, [props.type]);


    return (icon);
}