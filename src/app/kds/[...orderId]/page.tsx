import React from 'react'

export default function Order(props: any) {
    const odrerId = props.params.orderId[0];
    return (
        <div>Order Id :{odrerId}</div>
    )
}
