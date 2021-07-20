import React from 'react';
import dynamic from 'next/dynamic'

const Editor = dynamic(import('../modules/forum/components/editor'), {ssr: false})
export default function Edtior() {
    console.log('Query');
    return (
    <Editor/>
    )
}