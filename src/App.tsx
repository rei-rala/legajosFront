import './styles/globals.css'
import Layout from './components/layout'
import { useLoading, WorkflowContext } from './context'
import { Navigate, Route, Routes } from 'react-router-dom'
import { WorkflowPage, WfResumen, WfTablas } from './routes'


function App() {
  const { isLoading } = useLoading()

  return (
    <Layout>
      <WorkflowContext>
        {isLoading && <div>LOADING...</div>}

        <Routes>
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/workflow/analistas" element={<WfResumen />} />
          <Route path="/workflow/tablas" element={<WfTablas />} />
          <Route path="/workflow/tablas/:seccion" element={<WfTablas />} />

          <Route
            path="/workflow/*"
            element={<Navigate to="/workflow/tablas" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/workflow" />}
          />
        </Routes>

      </WorkflowContext>
    </Layout>
  )
}

export default App;
