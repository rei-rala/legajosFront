import './styles/globals.css'
import Layout from './components/layout'
import { useLoading, WorkflowContext } from './context'
import { Navigate, Route, Routes } from 'react-router-dom'
import WfMain from './routes/WfMain'
import WfResumen from './routes/WfResumen'


function App() {
  const { isLoading } = useLoading()

  return (
    <Layout>
      <WorkflowContext>
        {isLoading && <div>LOADING...</div>}

        <Routes>
          <Route path="/workflow" element={<WfMain />}  />
          <Route path="/workflow/resumen" element={<WfResumen />} />

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
