
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LoadingContext, WorkflowContext, TablesWFContext, UserContext } from './context'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoadingContext>
      <WorkflowContext>
        <TablesWFContext>
          <UserContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UserContext>
        </TablesWFContext>
      </WorkflowContext>
    </LoadingContext>
  </React.StrictMode>
)
