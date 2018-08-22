import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import SOFRequests from './sof-requests';
import Scrolling from './sof-scrolling';

import './index.css';

class SOFTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			domain: 'stackoverflow',
			currentPage: 1,
			stringsNumber: 30,
			questionsItems: [],
			mwState: false,
			headers: {
				author: 'Author',
				title: 'Title',
				date: 'Date of creation',
				linkName: 'Link to original'
			}
		}
		this.getQuestions = ()=>{};
	}
	
	componentDidMount() {
		var self = this;
		init();

		function init() {
			console.log('INIT')
			self.getQuestions = getQuestions;
			getQuestions();
			Scrolling.scrollInit(getQuestions);
		}

		function getQuestions() {
			SOFRequests.getQuestions(self.state.domain,self.state.currentPage, self.state.stringsNumber).then(
				function(resp) {
					var items = resp.items;
					console.log(resp)
					self.setState((prevState) => ({
						currentPage: prevState.currentPage ? prevState.currentPage + 1 : 1,
						questionsItems: prevState.questionsItems ? prevState.questionsItems.concat(new QuestionsObject(items)) : new QuestionsObject(items)
					}));
				}
			)
		}

		function QuestionsObject(items) {
			var qArray = [];
			
			items.forEach(function(o,index) {
				var dateString = timestampToDate(o.creation_date);
				var date = dateString.getDate();
				var month = (dateString.getMonth()+1);
				var year = dateString.getFullYear();
				var raw = {
					title: o.title,
					date: date + '.' + (month < 10 ? '0'+month : month) + '.' + year,
					url: o.link,
					body: o.body,
					owner: o.owner.display_name
				}
				qArray.push(raw);
			})
			
			return qArray;
		}
		
		function timestampToDate(secs) {
			var t = new Date(1970, 0, 1);
			t.setSeconds(secs);
			return t;
		}
	}
	
	changeDomain(e, status) {
		var domain;
		if(status === 1)
			domain = 'ru.stackoverflow'
		else
			domain = 'stackoverflow';
		
		this.setState((prev)=>({
			domain: domain,
			currentPage: 1,
			stringsNumber: 30,
			questionsItems: [],
			headers: {
				author: status === 1 ? 'Автор' : 'Author',
				title: status === 1 ? 'Заголовок' : 'Title',
				date: status === 1 ? 'Дата создания' : 'Date of creation',
				linkName: status === 1 ? 'Ссылка на оригинал' : 'Link to original'
			}
		}), function() {
			SOFRequests.abort();
			this.getQuestions();	
		});
		
		jQuery(e.currentTarget).nextAll().removeClass('active');
		jQuery(e.currentTarget).prevAll().removeClass('active');
		jQuery(e.currentTarget).addClass('active');
	}
	
	showMw(content) {
		document.body.classList.add('overflow-hidden');
		this.setState((prev)=>({
			mwState: true,
			mwContent: content
		}));
	}
	
	closeMw(event, toClose) {
		if((!jQuery('[data-modalwindowbody]').is(event.target) && jQuery('[data-modalwindowbody]').has(event.target).length === 0) || toClose) {
			document.body.classList.remove('overflow-hidden');
			this.setState((prev)=>({
				mwState: false,
				mwContent: undefined
			}));
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className="sof_change_language">
					<div className="sof_change_language__lang noselected active" onClick={(e)=>{this.changeDomain(e,0)}}>stackoverflow <sub>in english</sub></div>
					<div className="sof_change_language__lang noselected" onClick={(e)=>{this.changeDomain(e,1)}}>stackoverflow<sub>на русском</sub></div>
				</div>
				<table>
					<SOFTableHead author={this.state.headers.author} title={this.state.headers.title} date={this.state.headers.date} />
					<SOFTableBody showMw={this.showMw.bind(this)} questionsItems={this.state.questionsItems} />
				</table>
				<SOFModalWindow status={this.state.mwState} close={this.closeMw.bind(this)} content={this.state.mwContent} linkName={this.state.headers.linkName} />
			</React.Fragment>
		);
	}
}

class SOFTableHead extends React.Component{
	render() {
		return (
			<thead>
				<tr>
					<td>{this.props.author}</td>
					<td>{this.props.title}</td>
					<td>{this.props.date}</td>
				</tr>
			</thead>
		);
	}
}

class SOFTableBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	
	getCell(columns) {
		var staticArray = columns;
		return staticArray.map((a,b) => {
			return <td key={b} dangerouslySetInnerHTML={{__html: a}}></td>;
		});
	}
	
	getString(questionsItems) {
		var staticArray = questionsItems;
		var columns = [];
		
		if(questionsItems) {
			//console.log('questionsItems',questionsItems);
			return staticArray.map((a,b) => {
				columns = [];
				columns.push(a.owner);
				columns.push(a.title);
				columns.push(a.date);
				return <tr key={b} onClick={()=>{this.props.showMw(a)}}>{this.getCell(columns)}</tr>;
			});
		}
	}
	
	
	render() {
		return (
			<tbody>
				{this.getString(this.props.questionsItems)}
			</tbody>
		);
	}
}

class SOFModalWindow extends React.Component {
	constructor(props) {
		super(props);
		var self = this;
		console.log(self.props)
	}
	
	getClass() {
		var classes;
		if(this.props.status === true)
			classes = 'sofQuestions__modalWindow active'
		else
			classes = 'sofQuestions__modalWindow';
		
		return classes;
	}
	
	
	render() {
		if(this.props.status) {
			return (
				<div className={this.getClass()} onClick={(e)=>this.props.close(e)}>
					<div className="sofQuestions__modalWindow__body" data-modalwindowbody>
						<div className="sofQuestions__modalWindow__close" onClick={(e, toClose)=>this.props.close(e, true)}>
							<FontAwesomeIcon icon={faTimes} />
						</div>
						
						<div className="sofQuestions__modalWindow__content">
							<h2 dangerouslySetInnerHTML={{__html: this.props.content.title}}></h2>
							<div className="sofQuestions__modalWindow__content__text" dangerouslySetInnerHTML={{__html: this.props.content.body}}></div>
						</div>
						<a className="sofQuestions__modalWindow__link" href={this.props.content.url} target="_blank">{this.props.linkName}</a>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
}

// ========================================


ReactDOM.render(
	<SOFTable />,
	document.querySelector('[data-sofQuestionsRoot]')
);