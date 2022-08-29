import React, { Component } from 'react'
import  {Fade} from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import {
    Flex,
    Box,
} from '@chakra-ui/react'

const fadeImages = [
    {
    url: 'images/back_pic.jpg',
    caption: 'First Slide'
    },
    // {
    // url: 'images/college_friends.jpg',
    // caption: 'Second Slide'
    // },
    {
    url: 'images/pyramix.jpg',
    caption: 'Third Slide'
    },
  ];
  
  const Slideshow = () => {
    return (
      <div className="slide-container">
        <Fade>
          {fadeImages.map((fadeImage, index) => (
            <div className="each-fade" key={index}>
              <div className="image-container">
                <img className='fadingImgs' src={fadeImage.url} />
              </div>
              <h2>{fadeImage.caption}</h2>
            </div>
          ))}
        </Fade>
      </div>
    )
  }

class Content extends Component {
    render () {
        return (
            <section className='about-me'>
                    <div>
                        <Slideshow />
                    </div>
                    <div className='intro-text'>
                        <h2 className='header'> Hey! The name's Mahdi</h2>
                        <p className='introduction'>
                            I’m a sophomore at Columbia University studying 
                            Computer Science. I embody and value creativity, 
                            collaboration, and a continuously learning mindset – 
                            all of which is achievable in the tech industry. 
                            Currently, I’d like to get my hands on mobile app development, AI, or 
                            even Fintech. In my downtime, I like to play badminton or ping pong, watch anime, 
                            and 3-D combination puzzles.
                            <br />
                            Feel free to check out other parts of this website!
                            <br />
                            You can also look at these platforms to reach out or 
                            learn more about me:
                        </p>
                        {/* <Box className='platforms'>
                            <img className='github' src='/github-logo.png' />
                            <img className='linkedin' src='/linkedin-logo.png'/>
                            <img className='gmail' src='/github-logo.png' />
                        </Box> */}
                    </div>
            </section>
        )
    }
}

export default Content