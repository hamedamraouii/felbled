import  React,{useState} from "react";
import './OneUser.css'; 
import './update.css';
import Footer from'../Footer'; 
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaSnapchat, FaEdit, FaPlus,FaTimes } from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs";
const initialSocialIcons = [
  { id: 1, name: 'Facebook', icon: <FaFacebook /> },
  { id: 2, name: 'X', icon: <BsTwitterX /> },
  { id: 3, name: 'Instagram', icon: <FaInstagram /> },
];


const initialTags = ['React', 'JavaScript', 'Web Development'];

const initialServices = ['Web Design', 'App Development', 'SEO Optimization'];

const initialImages = [
  { id: 1, src: 'logo11.png', alt: 'Image 1' },
  { id: 2, src: 'logo12.png', alt: 'Image 2' },
];


const sallesDeFetes = [
    {
      name: "Le Grand Palais",
      logo_url: "/logo11.png",
        images_url: [
            "/image3.jpg",
            "/image31.jpg"
          ],
      location: "Tunis",
      address: "123 Avenue de la République, Tunis, Tunisia",
      categories: ["Weddings", "Corporate Events", "Birthdays", "Conferences"],
      services: [
        {
          name: "Catering",
          description: "Customizable catering options to suit all types of events, from small gatherings to large banquets."
        },
        {
          name: "Decorations",
          description: "Elegant decoration packages to match the theme of your event, including floral arrangements, lighting, and more."
        },
        {
          name: "Sound & Lighting",
          description: "State-of-the-art sound and lighting systems to ensure your event is illuminated and has the best acoustics."
        },
        {
          name: "Event Planning",
          description: "Professional event planners who will help you organize every detail of your event, from start to finish."
        },
        {
          name: "DJ & Music",
          description: "Experienced DJs providing a wide range of music to keep your guests entertained throughout the event."
        },
        {
          name: "Security",
          description: "Professional security personnel to ensure the safety and smooth operation of your event."
        },
        {
          name: "Parking",
          description: "Ample parking space for guests, ensuring easy access to the venue."
        },
        {
          name: "Photographer",
          description: "Professional photographers to capture the best moments of your event."
        },
        {
          name: "Children's Entertainment",
          description: "Activities and entertainment designed for children, including games, clowns, and face painting."
        },
        {
          name: "Transportation",
          description: "Transportation services to and from the venue for your guests, including shuttle buses and private vehicles."
        }
      ]
    },
    {
      name: "Le Château des Rêves",
      logo_url: "/logo12.png",
      images_url: [
        "/image1.jpg",
        "/image12.jpg",

      ],
      location: "SBsTwitterX",
      address: "456 Boulevard des Rêves, SBsTwitterX, Tunisia",
      categories: ["Weddings", "Anniversaries", "Banquets", "Concerts"],
      services: [
        {
          name: "Catering",
          description: "Gourmet cuisine prepared by expert chefs, offering a variety of menus for all tastes and preferences."
        },
        {
          name: "Luxury Car Hire",
          description: "Elegant car rental services for transportation, including luxury cars and limousines."
        },
        {
          name: "Stage & Set Design",
          description: "Full stage and set design services for theatrical events, performances, and shows."
        },
        {
          name: "Private Rooms",
          description: "Private rooms for VIPs or smaller, more intimate gatherings."
        },
        {
          name: "Event Coordination",
          description: "Full event coordination services, ensuring your event goes off without a hitch."
        },
        {
          name: "Security",
          description: "Highly trained security teams to provide a safe environment for guests and performers."
        },
        {
          name: "Photo Booth",
          description: "Fun photo booths with props and instant prints for guests to enjoy."
        },
        {
          name: "Stage Lighting",
          description: "High-quality stage lighting setups for performances, parties, and special effects."
        },
        {
          name: "Valet Parking",
          description: "Valet parking service for guests to ensure a seamless experience upon arrival."
        },
        {
          name: "Sound System",
          description: "High-end sound system rental for speeches, music, and entertainment."
        }
      ]
    },
    {
      name: "La Villa Étoilée",
      logo_url: "/logo13.png",
      images_url: [
        "/image2.jpg",
        "/image21.jpg"
      ],
      location: "Carthage",
      address: "789 Avenue des Etoiles, Carthage, Tunisia",
      categories: ["Weddings", "Gala Dinners", "Product Launches", "Corporate Seminars"],
      services: [
        {
          name: "Catering",
          description: "Exclusive catering services offering a variety of international cuisines and personalized menus."
        },
        {
          name: "Event Hosting",
          description: "Our expert hosts provide seamless event hosting services, from managing guests to coordinating the event."
        },
        {
          name: "Dance Floor",
          description: "A spacious dance floor for parties, weddings, and celebrations with the latest sound system."
        },
        {
          name: "Stage Production",
          description: "Full-scale stage production including equipment, lighting, and setup for concerts and shows."
        },
        {
          name: "Live Music",
          description: "Live bands and musicians for all types of events, including jazz, classical, and contemporary music."
        },
        {
          name: "Bridal Suite",
          description: "Private bridal suites for couples to relax and prepare for their special day."
        },
        {
          name: "24/7 Customer Support",
          description: "Our team provides 24/7 assistance for any questions or needs during the planning process."
        },
        {
          name: "Gift Bags",
          description: "Customizable gift bags for guests to take home as a memorable token of the event."
        },
        {
          name: "Smoking Area",
          description: "Designated smoking areas equipped with seating and comfort for smokers."
        },
        {
          name: "Event Setup & Breakdown",
          description: "Complete event setup and breakdown service to ensure everything runs smoothly from start to finish."
        }
      ]
    }
  ];

  
  const OneUserUpdate=()=>{
    const venue = sallesDeFetes[0]; 
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupImage, setPopupImage] = useState('');
    const [imageTitle, setImageTitle] = useState('Image Title');
    const [location, setLocation] = useState('Location Info');
    const [bio, setBio] = useState('This is my bio.');
    const [socialIcons, setSocialIcons] = useState(initialSocialIcons);
    const [tags, setTags] = useState(initialTags);
    const [services, setServices] = useState(initialServices);
    const [images, setImages] = useState(initialImages);
    const [showSocialPopup, setShowSocialPopup] = useState(false);  
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      if (file) reader.readAsDataURL(file);
    };
  

    const closePopup = () => {
      setIsPopupOpen(false);
      setPopupImage('');
    };
    const handleDeleteItem = (id) => {
      if (selectedList === 'socialIcons') {
        setSocialIcons(socialIcons.filter(item => item.id !== id));
      } else if (selectedList === 'tags') {
        setTags(tags.filter(item => item !== id));
      } else if (selectedList === 'services') {
        setServices(services.filter(item => item !== id));
      } else if (selectedList === 'images') {
        setImages(images.filter(item => item.id !== id));
      }
      setShowDeletePopup(false);
    };
  
    const handleAddItem = (item) => {
      if (selectedList === 'socialIcons') {
        setSocialIcons([...socialIcons, item]);
      } else if (selectedList === 'tags') {
        setTags([...tags, item]);
      } else if (selectedList === 'services') {
        setServices([...services, item]);
      }
      setShowAddPopup(false);
    };
  
    const filteredItems = (list) => {
      if (!searchTerm) return list;
      return list.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.toLowerCase().includes(searchTerm.toLowerCase()));
    };


  
    return (
      <div className="oneUser-container">
        <div className="container">
          <div className="left-section">
            <div className="ad">Ad Section</div>
          </div>
  
          <div className="middle-section">
          <div className="container-update">
          <h1 className="title-update">User Name</h1>
      <div className="header-update">
        <div className="image-section-update">
          <img
            src={newImage || '/logo11.png'}
            alt="example"
            className="image-update"
          />
          <div className="image-change-btn">
            <label htmlFor="image-upload">
              <FaEdit />
            </label>
            </div>
            <input
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
          
</div>
<div>
          <input
            type="text"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            className="image-title-update"
          />
        
        <div className="location-update">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-input-update"
        />
      </div>
      </div>
      </div>


      <hr />

      <div className="bio-update">
        <h2>Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bio-textarea-update"
        />
      </div>

      <hr />

      <div className="social-icons-update">
        <h2>Social Icons</h2>
        <div className="social-list-update">
          {socialIcons.map((icon) => (
            <div key={icon.id} className="social-item-update">
              <div className="social-icon-update">{icon.icon}</div>
              <span>{icon.name}</span>
              <button className="close-btn-update-icons" onClick={() => { setShowDeletePopup(true); setDeleteItemId(icon.id); setSelectedList('socialIcons'); }}>
                <FaTimes className="close-btnn" />
              </button>
            </div>
          ))}
          <button
            onClick={() => { setShowAddPopup(true); setSelectedList('socialIcons'); }}
            className="add-icon-btn-update"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="tags-update">
        <h2>Tags</h2>
        <div className="tags-list-update">
          {tags.map((tag, index) => (
            <div key={index} className="tag-item-update">
              {tag}
              <button className="close-btn-update" onClick={() => { setShowDeletePopup(true); setDeleteItemId(tag); setSelectedList('tags'); }}>
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            onClick={() => { setShowAddPopup(true); setSelectedList('tags'); }}
            className="add-tag-btn-update"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="services-update">
        <h2>Services</h2>
        <div className="services-list-update">
          {services.map((service, index) => (
            <div key={index} className="service-item-update">
              {service}
              <button className="close-btn-update" onClick={() => { setShowDeletePopup(true); setDeleteItemId(service); setSelectedList('services'); }}>
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            onClick={() => { setShowAddPopup(true); setSelectedList('services'); }}
            className="add-service-btn-update"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="images-update">
        <h2>Images</h2>
        <div className="images-list-update">
          {images.map((image) => (
            <div key={image.id} className="image-item-update">
              <img src={image.src} alt={image.alt} className="image-thumbnail-update" />
              <button className="close-btn-update-images" onClick={() => { setShowDeletePopup(true); setDeleteItemId(image.id); setSelectedList('images'); }}>
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            onClick={() => { document.getElementById('image-upload').click(); }}
            className="add-image-btn-update"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <div className="overlay-update">
          <div className="popup-update">
            <h3>etes-vous sur de supprimer cet ?</h3>
            <button onClick={() => handleDeleteItem(deleteItemId)} className="delete-btn-update">Yes</button>
            <button onClick={() => setShowDeletePopup(false)} className="close-btn-update-no">No</button>
          </div>
        </div>
      )}

      {showAddPopup && (
        <div className="overlay-update">
          <div className="popup-update">
            <h3>Add Item</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-update"
              placeholder="Search..."
            />
            <div className="search-list-update">
              {filteredItems(selectedList === 'socialIcons' ? socialIcons : tags).map((item, index) => (
                <div key={index} onClick={() => handleAddItem(item)} className="search-item-update">
                  {item.name || item}
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddPopup(false)} className="close-btn-update-no">Close</button>
          </div>
        </div>        
      )}
                <hr />
                <div className="refs-update">
            <a> Voir comme Client </a>
            <a> Modifier Mon Profile </a>
            </div>

    </div>
          </div>
          <div className="right-section">
            <div className="ad">Ad Section</div>
          </div>
        </div>
  
        {/* Popup for user image */}
        {isPopupOpen && (
          <div className="image-popup-logo">
            <div className="popup-overlay-logo" onClick={closePopup}></div>
            <div className="popup-content-logo">
              <img src={popupImage} alt="Popup" className="popup-image-logo" />
              <button className="close-popup-logo" onClick={closePopup}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        <Footer/>
      </div>
    );
  };
  
  export default OneUserUpdate;