import React, { Component } from 'react'
import './App.css'

import 'font-awesome/css/font-awesome.min.css'
import ResizablePanels from './components/resize-panel'
import Dropdown from './components/dropdown'
import FontAwesome from 'react-fontawesome'
import ContentEditable from 'react-contenteditable'

import ListView from './components/keylist'
import ListItem from './components/keylist/list-item'
import ButtonBar from './components/button-bar'

class App extends Component {

  constructor(){
    super()
    this.contentEditable = React.createRef()
    this.state = {
        items: Array.from({ length: 20 }),
        hasMore: true,
        height: 500,
        html: "hjkhjkhjkhjk",
      location: [
        {
          id: 0,
          title: 'New York',
          selected: false,
          key: 'location'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location'
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location'
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location'
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location'
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location'
        },
        {
          id: 6,
          title: 'Zurich',
          selected: false,
          key: 'location'
        }
      ],
      fruit: [
        {
          id: 0,
          title: 'Apple',
          selected: false,
          key: 'fruit'
        },
        {
          id: 1,
          title: 'Orange',
          selected: false,
          key: 'fruit'
        },
        {
          id: 2,
          title: 'Grape',
          selected: false,
          key: 'fruit'
        },
        {
          id: 3,
          title: 'Pomegranate',
          selected: false,
          key: 'fruit'
        },
        {
          id: 4,
          title: 'Strawberry',
          selected: false,
          key: 'fruit'
        }
      ]
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    console.log(e)
  }
  componentDidMount() {
    const height =  document.documentElement.scrollHeight -180;
    this.setState({
      height
    })
  }

  toggleSelected = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp[id].selected = !temp[id].selected
    this.setState({
      [key]: temp
    })
  }

  resetThenSet = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp.forEach(item => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp
    })
  }

  fetchMoreData = () => {
    if (this.state.items.length >= 500) {
      this.setState({ hasMore: false });
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(Array.from({ length: 20 }))
      });
    }, 500);
  }

  handleTabChange(e) {
    console.log('HERE', e)
  }

  render () {
    return (
      <div className='App'>
        <ResizablePanels>
          <div className="App">
          <div className="wrapper">
          <Dropdown
            title="Cache"
            list={this.state.fruit}
            resetThenSet={this.resetThenSet}
          /> 
         <a href="#" className="btn btn-4"><span>New <FontAwesome name='bolt' /></span></a> 
          </div>
          <div className="pattern-input" style={{marginTop: '-10'}}>
          <FontAwesome name ='search' style={{margin:'15px', position: 'absolute'}} />
              <input
                type="text"
                className="search-input"
                placeholder="Key name or patterns (e.g. user:*)"
                value={this.state.pattern}
                onChange={evt => {
                  this.updatePattern(evt.target.value)
                }}
                />
        </div>
          <div>
          <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', paddingTop:'5px'}}>
          <button style={{cursor:'pointer'}}><FontAwesome name='plus' /></button>
          <button style={{cursor:'pointer'}}><FontAwesome name ='refresh' /></button> 
          <button style={{cursor:'pointer'}}><FontAwesome name='trash-o' /></button>
          </div>
          </div>
          <div>
          <ListView
          height={this.state.height}
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          
          {this.state.items.map((i, index) => (
            <ListItem name={`key - ${index}`} key={index}>
              div - #{index}
            </ListItem>
          ))}
        </ListView>
          </div>
          </div>
         <div>
           <div style={{height:'45px', width:'100%', backgroundColor:'#f0f0f0'}}>
           <ButtonBar
            items={['Data', 'Analyze']}
            activeTab='Data'
            onSelectTab={this.handleTabChange.bind(this)}
          />
           </div>
           <div style={{paddingTop:'10px', paddingRight: '20px'}}>
           <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
           <div style={{paddingLeft: '5px', cursor:'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='expand' />  </div>
           <div style={{paddingLeft: '5px', cursor:'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='compress' />  </div>
          <div style={{paddingLeft: '5px', cursor:'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='save' />  </div>
          <div style={{paddingLeft: '5px', cursor:'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='trash-o' /> </div>
        </div>
           </div>
         
           <div style={{minHeight:'600px', width: '100%'}}>
           <ContentEditable
              innerRef={this.contentEditable}
              html={this.state.html} // innerHTML of the editable div
              disabled={false}       // use true to disable editing
              onChange={this.handleChange} // handle innerHTML change
              tagName='article' // Use a custom HTML tag (uses a div by default)
            />
           </div>
        </div>
        </ResizablePanels>
      </div>
    )
  }
}

export default App
