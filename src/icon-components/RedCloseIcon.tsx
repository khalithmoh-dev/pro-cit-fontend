import React from 'react'
import { SVGProps } from './ArrowLeftIcon'
import { GREY_4 } from '../theme/color'

const RedCloseIcon: React.FC<SVGProps> = ({ width = 20, height = 20 }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000">

            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

            <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#ff0000" stroke-width="1.5" /> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#ff0000" stroke-width="1.5" stroke-linecap="round" /> </g>

        </svg>
    )
}

export default RedCloseIcon