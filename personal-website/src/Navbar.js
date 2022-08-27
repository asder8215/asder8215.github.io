import React, { Component } from 'react'

class Navbar extends Component {
    render () {
        return (
            <div className='Navbar'>
                <div className='Mahdi satisfy'>
                    Mahdi Ali-Raihan
                </div>
                <div className='Intro messiri'>
                    About Me
                </div>
                <div className='Proj/Exp messiri'>
                    Projects/Experiences
                </div>
                <div className='Resume messiri'>
                    Resume
                </div>
            </div>
        )
    }
}

export default Navbar