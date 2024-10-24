const Part = ({name, exercises}) =>{
  return(
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({parts}) =>{

  let total = parts.reduce((sum, part) => sum + part.exercises, 0)
  
    return(
      <div>
        {parts.map((part) => (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p><strong>Total of {total} exercises </strong></p>
      </div>
      
  
    )
  }


const Header =({course}) =>{
  return(
    <h1>{course.name} </h1>
  )
}

const Course = ({ course }) => {
    return(
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
      </div>
    )
  }

export default Course