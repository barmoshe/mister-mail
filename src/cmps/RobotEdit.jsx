import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { robotService } from "../services/robot.service"

export function RobotEdit() {
    const navigate = useNavigate()
    const context = useOutletContext()
    const { robotId } = useParams()

    const [robot, setRobot] = useState(robotService.getDefaultRobot())

    useEffect(() => {
        if (robotId) loadRobot()
    }, [])

    async function loadRobot() {
        try {
            const robot = await robotService.getById(robotId)
            setRobot(robot)
        } catch (err) {
            console.log('Had issues loading robot', err);
        }
    }


    function handleChange({ target }) {
        let { value, type, name: field } = target
        if (type === 'range') value = +value
        setRobot(prevRobot => ({ ...prevRobot, [field]: value }))
    }

    async function onSaveRobot(ev) {
        ev.preventDefault()
        try {
            if (robot.id) await context.onUpdateRobot(robot)
            else await context.onAddRobot(robot)
            navigate('/robot')
        } catch (err) {
            console.log('Had issues saving robot', err)
        }
    }

    return (
        <section className="robot-edit">
            <Link to="/robot"><button className="close-btn">X</button></Link>
            <h1>{robot.id ? 'Update' : 'Add'} Robot</h1>
            <form onSubmit={onSaveRobot}>
                <label htmlFor="model">Model</label>
                <input type="text" id="model" name="model" value={robot.model} onChange={handleChange} />

                <label htmlFor="type">Type</label>
                <select value={robot.type} onChange={handleChange}
                    id="type" name="type" >
                    <option value="">Choose a type</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Pleasure">Pleasure</option>
                    <option value="Office">Office</option>
                </select>

                <label> Battery status {robot.batteryStatus}
                    <input value={robot.batteryStatus} onChange={handleChange}
                        type="range" id="battery" name="batteryStatus" />
                </label>
                <button>Save</button>
            </form>
        </section>
    )
}
