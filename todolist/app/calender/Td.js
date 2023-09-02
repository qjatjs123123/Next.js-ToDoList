'use client'

export default function Td(props){
    return(
        <td onClick={() => props.setDate(props.day)}>{props.day}</td>
    )
}