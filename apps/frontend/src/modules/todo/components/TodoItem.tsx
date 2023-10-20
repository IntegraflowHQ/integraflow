import { RxDocument } from 'rxdb'
import { TodoDoc } from '../../../database/schemas/todo.schema'

export default function TodoItem({todo}: {todo: RxDocument<TodoDoc>}) {
  return (
    <div>
      <input type="checkbox" defaultChecked={todo.done} onChange={e => {todo.incrementalUpdate({
        $set: {
          done: e.target.checked
        }
      })}} />
      {todo.name}

      <button onClick={async () => {
        await todo.remove()
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 11-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
