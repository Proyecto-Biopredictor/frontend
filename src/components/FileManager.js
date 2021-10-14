import React, { Component } from 'react'

import { CSVReader, jsonToCSV, readString } from 'react-papaparse'

import Controls from './controls/Controls'

const buttonRef = React.createRef()

export default class FileManager extends Component {
    handleOpenDialog = (e) => {
      // Note that the ref is set async, so it might be null at some point
      if (buttonRef.current) {
        buttonRef.current.open(e)
      }
    }
  
    handleOnFileLoad = (data) => {
        console.log('---------------------------')
        console.log(data)
        let info=[];
        for(const a of data ){
            delete a.data.__parsed_extra;
            info.push(a.data);
        }
        if(!info[info.length]){
            info.pop();
        }
        console.log("maci");
        console.log(info);
        console.log('---------------------------')
    }
  
    handleOnError = (err, file, inputElem, reason) => {
      console.log(err)
    }
  
    handleOnRemoveFile = (data) => {
      console.log('---------------------------')
      console.log(data)
      console.log('---------------------------')
    }
  
    handleRemoveFile = (e) => {
      // Note that the ref is set async, so it might be null at some point
      if (buttonRef.current) {
        buttonRef.current.removeFile(e)
      }
    }
  
    render() {
      return (
        <CSVReader
          ref={buttonRef}
          onFileLoad={this.handleOnFileLoad}
          onError={this.handleOnError}
          noClick
          noDrag
          onRemoveFile={this.handleOnRemoveFile}
          config={{header:true, quoteChar:'`'}}
        >
          {({ file }) => (
            <aside
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 10
              }}
            >
              <Controls.Button
                variant='contained'
                onClick={this.handleOpenDialog}
                style={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  width: '40%',
                  paddingLeft: 0,
                  paddingRight: 0
                }}
                text="Elegir archivo"
              />
                
              <div
                style={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#ccc',
                  height: 45,
                  lineHeight: 2.5,
                  marginTop: 5,
                  marginBottom: 5,
                  paddingLeft: 13,
                  paddingTop: 3,
                  width: '60%'
                }}
              >
                {file && file.name}
              </div>
              <Controls.Button
              variant='contained'
                style={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  paddingLeft: 20,
                  paddingRight: 20
                }}
                onClick={this.handleRemoveFile}
                text="Eliminar"
              />
            </aside>
          )}
        </CSVReader>
      )
    }
  }