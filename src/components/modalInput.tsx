import { baseUrl } from '@/constant/url';
import axios from 'axios';
import { useState, FormEvent, useEffect } from 'react';
import { swalError, swalTopEnd } from './swal';


export default function ModalInput({ modal, setModal, fetch }: any) {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        photo: '',
        id: ''
    })

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (modal.type === 'add') {
            console.log('masuk');
            console.log(data);

            await axios({
                method: 'POST',
                url: baseUrl,
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    age: data.age,
                    photo: data.photo,
                }
            }).then(() => {
                fetch()
                swalTopEnd('Success add contact')
                setModal((prevState: any) => ({ ...prevState, isOpen: false }))
            }).catch(err => swalError(err))
        } else if (modal.type === 'edit') {
            axios({
                method: 'PUT',
                url: baseUrl + `/${data.id}`,
                data: data
            }).then(() => {
                fetch()
                swalTopEnd('Success edit contact')
                setModal((prevState: any) => ({ ...prevState, isOpen: false }))
            }).catch(err => swalError(err))
        }
    }

    useEffect(() => {
        if (modal.type === 'edit') setData(modal.value)
        else setData({
            firstName: '',
            lastName: '',
            age: '',
            photo: '',
            id: ''
        })
    }, [modal.type])

    if (!modal.isOpen) return
    return (
        <div className="modal">
            <div className="bg-blur" onClick={() => setModal((prevState: any) => ({ ...prevState, isOpen: false }))}></div>
            <form className="modal-input" onSubmit={handleSubmit}>
                <input type="text" placeholder='First Name' value={data.firstName} onChange={e => setData({ ...data, firstName: e.target.value })} />
                <input type="text" placeholder='Last Name' value={data.lastName} onChange={e => setData({ ...data, lastName: e.target.value })} />
                <input type="number" placeholder='Age' value={data.age} onChange={e => setData({ ...data, age: e.target.value })} />
                <input type="text" placeholder='Image URL' value={data.photo} onChange={e => setData({ ...data, photo: e.target.value })} />
                <button type='submit'>Confirm</button>
            </form>
        </div>
    )
}