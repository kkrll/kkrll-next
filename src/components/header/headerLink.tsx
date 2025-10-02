import Link from "next/link"
import React from "react"

const HeaderLink = ({to, children}:{
    to: string
    children: React.ReactNode
}) => {
    return <Link href={to}>{children}</Link>
}

export default HeaderLink