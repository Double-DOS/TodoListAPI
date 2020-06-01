import React from 'react';
import './App.css';
import { render } from '@testing-library/react';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			todoList:[],
			activeItem:{
				id:null,
				title:'',
				completed:false,
			},
			editing:false,
		}
		this.fetchTasks = this.fetchTasks.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.strikeUnstrike = this.strikeUnstrike.bind(this);
	}

	componentWillMount(){
		this.fetchTasks()
	}

	fetchTasks(){
		console.log('Fetching Tasks....')
		fetch('http://localhost:8000/api/task-list/')
		.then(response => response.json())
		.then(data =>
			this.setState({
				todoList:data
			})
			)
	}

	handleChange(e){
		var name = e.target.name
		var value = e.target.value
		console.log('Name', name)
		console.log('Value:', value)

		this.setState({
			activeItem:{
				...this.state.activeItem,
				title:value
			}
		})
	}

	handleSubmit(e){
		e.preventDefault()
		console.log('Item:', this.state.activeItem)
		var url = 'http://localhost:8000/api/task-create/'

		if(this.state.editing === true){
			url = `http://localhost:8000/api/task-update/${this.state.activeItem.id}/`
			this.setState({
				editing:false,
			})
		}
		fetch(url,{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
			},
			body:JSON.stringify(this.state.activeItem)
		}).then((response) => {
			this.fetchTasks()
			this.setState({
				activeItem:{
					id:null,
					title:'',
					completed:false,
				}
			})
		}).catch(function(error){
			console.log('ERROR:', error)
		})
	}

	startEdit(task){
		this.setState({
			activeItem:task,
			editing: true,
		})
	}

	deleteItem(task){
		fetch(`http://localhost:8000/api/task-delete/${task.id}/`,{
			method:'DELETE',
			headers:{
				'Content-Type':'application/json'
			},
		}).then((response) =>{
			this.fetchTasks()
		})
	}

	strikeUnstrike(task){
		task.completed = !task.completed
		console.log('TASK:', task.completed)
		fetch(`http://localhost:8000/api/task-update/${task.id}/`,{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
			},
			body:JSON.stringify({'completed':task.completed, 'title':task.title})
		}).then(()=>{
			this.fetchTasks()
		})
	}

  	render(){
		var tasks = this.state.todoList
		var self = this
		return(
			<div className="container">
				<div id="task-container">
					<div id="form-wrapper">
						<form onSubmit={this.handleSubmit} id="form">
							<div className="flex-wrapper">
								<div style={{flex: 6}}>
									<input onChange={this.handleChange} type="text" className="form-control" name="title" value={this.state.activeItem.title} id="title" placeholder="Add Task"/>
								</div>
								<div style={{flex: 1}}>
									<input id="submit" className="btn btn-success" type="submit" value="Submit" name="add"/>
								</div>
							</div>
						</form>
					</div>
					<div id="list-wrapper">
						{tasks.map(function(task, index){
							return(
								<div key={index} className="task-wrapper flex-wrapper">
									<div onClick={() => self.strikeUnstrike(task)} style={{flex: 7}}>
										{task.completed === false ?(
											<span>{task.title}</span>
										): (
											<strike>{task.title}</strike>
										)}
									</div>
									<div style={{flex: 1}}>
										<button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info edit">Edit</button>
									</div>
									<div style={{flex: 1}}>
										<button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
  	}
}

export default App;
