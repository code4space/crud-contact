"use client"
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import { getContact } from '@/store/actions/fetchContact';
import { ContactState } from '@/store/reducers/contact';
import Loading from '@/components/loading';
import VanillaTilt from 'vanilla-tilt';
import NeonButton from '@/components/neonButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import ModalInput from '@/components/modalInput';
import axios from 'axios';
import { baseUrl } from '@/constant/url';
import { swalError, swalTopEnd } from '@/components/swal';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  photo: string;
}

const ImageChecker: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [imageExists, setImageExists] = useState(true);

  const handleImageError = () => {
    setImageExists(false);
  };

  return (
    <>
      {imageExists ? (
        <img
          src={imageUrl}
          alt="Your Image"
          onError={handleImageError}
        />
      ) : (
        <img
          src="https://openclipart.org/image/800px/266217"
          alt="Fallback Image"
        />
      )}
    </>
  );
};

export default function Home() {
  const dispatch = useDispatch()
  const data: Contact[] = useSelector((state: { ContactReducer: { contact: Contact[] } }) => state.ContactReducer.contact);
  const [contact, setContact] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [flip, setFlip] = useState(false)
  const [card, setCard] = useState({ isActive: false, index: 0 })
  const [modalOpt, setModalOpt] = useState(false)
  const [search, setSearch] = useState('')
  const [modalInp, setModalInp] = useState({ type: '', isOpen: false, value: {} })


  const cardRef: any = useRef(null);

  function fetch() {
    setLoading(true);
    dispatch(getContact())
      .then(() => {
        setContact(data); // Update the contact state after fetching data
        setLoading(false);
      });
  }

  useEffect(() => {
    VanillaTilt.init(cardRef.current, {
      max: 5,
      speed: 400,
      glare: true,
      'max-glare': 0.1,
      gyroscope: false,
    });

    fetch();
  }, [dispatch, data]);

  function cardClass() {
    let className = 'card-detail'
    if (flip) className += ' rotate'

    return className
  }

  function addContact() {
    setModalInp({ isOpen: true, type: 'add', value: {} })
  }

  function editContact(index: number) {
    setModalInp({ isOpen: true, type: 'edit', value: { ...contact[index] } })
  }

  function deleteContact(id: string) {
    Swal.fire({
      title: "Do you want to delete this contact?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(baseUrl + `/${id}`);

        axios({
          method: 'DELETE',
          url: baseUrl + `/${id}`
        })
          .then(() => {
            swalTopEnd('Delete Success')
            setCard({ isActive: false, index: 0 })
            fetch()
          })
          .catch(err => {
            swalError(err)
          })
      }
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value.toLowerCase();

    const filteredContacts = data.filter((el: any) => {
      const fullName = `${el.firstName} ${el.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    });

    setContact(filteredContacts);
    console.log(filteredContacts);
    
    setSearch(e.target.value);
  }

  if (loading) return <Loading />
  return (
    <div className="page">
      <h1 className='neon-text'>My Contact</h1>

      <div className="search-container">
        <button className="input__button__shadow">
          <SearchIcon />
        </button>
        <input type="text" className="input__search" placeholder="someone on your mind" onChange={onChange} value={search} />
        <div className="shadow__input"></div>
      </div>

      <div className="table-contact">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contact && contact.map((el: any, i: number) => {
              return (
                <tr key={i}>
                  <td>{el.firstName}</td>
                  <td>{el.lastName}</td>
                  <td>{el.age}</td>
                  <td>
                    <button onClick={() => setCard({ index: i, isActive: true })}>
                      <span className="actual-text">&nbsp;Detail&nbsp;</span>
                      <span className="hover-text">&nbsp;Detail&nbsp;</span>
                    </button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>

      {card.isActive &&
        <div className="modal">
          <div className="bg-blur" onClick={() => setCard({ ...card, isActive: false })}></div>
          <div className="card-wrapper" ref={cardRef}>
            <div className={cardClass()}>
              <div className="front-card">
                <MoreVertIcon onClick={() => setModalOpt(!modalOpt)} />
                {modalOpt &&
                  <>
                    <div className="opt">
                      <span onClick={() => editContact(card.index)}>edit</span>
                      <span onClick={() => deleteContact(contact[card.index].id)}>delete</span>
                    </div>
                  </>
                }
                <div className="card-img">
                  <ImageChecker imageUrl={contact[card.index].photo} />
                </div>
                <h3>{contact[card.index].firstName} {contact[card.index].lastName}</h3>
                <span>{contact[card.index].age}</span>
                <button onClick={() => setFlip(!flip)}>flip me</button>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam doloribus laudantium ducimus illum voluptatem! Ut in eum quia officiis at.</p>
              </div>
              <div className="back-card">
                <ImageChecker imageUrl={contact[card.index].photo} />
                <button onClick={() => setFlip(!flip)}>flip me</button>
              </div>
            </div>
          </div>
        </div>
      }

      <div className="action-button">
        <NeonButton onClick={addContact} />
      </div>

      <ModalInput modal={modalInp} setModal={setModalInp} fetch={fetch} />
    </div>
  );
}
