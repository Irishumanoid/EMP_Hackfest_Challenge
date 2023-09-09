

function App() {

  return (
    <>
      <div className='w-full mt-4 text-center'>
        <h1 className=''>Example Heading 1</h1>
        <h2 className=''>Example Heading 2</h2>
        <h3 className=''>Example Heading 3</h3>
        <h4 className=''>Example Heading 4</h4>
        <br></br>
        <p className='mx-auto max-w-md'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque inventore facere veritatis, vitae blanditiis doloribus unde nobis harum. Neque harum modi at! Saepe mollitia placeat modi rem, quae totam unde.</p>
        <br></br>
        <div>
          <a href='https://www.google.com' className=''>Example link</a>
        </div>
        <div>
          <a href='https://www.google.com' className='underline'>Example link</a>
        </div>
        <div className="mt-8 flex gap-6 justify-center items-center">
          <div className="button primary">Primary Button</div>
          <div className="button secondary">Secondary Button</div>
          <div className="button">Alternate Button</div>
          <div className="button destructive">Destructive Button</div>
        </div>
      </div>
    </>
  )
}

export default App
