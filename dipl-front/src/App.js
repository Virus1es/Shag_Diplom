import './styles/index.css';
import Flickity from "react-flickity-component";
const flickityOptions = {
  initialIndex: 2
}

// вывод книг в верхней части экрана
// м.б. будут новинки
function ShowUpperBooks() {
    let str = [];
    for (let i = 0; i < 5; i++) {
        let count = i * 5;
        str.push(
            <div className="book-cell">
                <div className="book-img">
                    <img src={require('./img/books/dostoevskii_nakazanie.jpg')}
                         alt="Преступление и наказание"
                         className="book-photo"/>
                </div>
                <div className="book-content">
                    <div className="book-title">Преступление и наказание</div>
                    <div className="book-author">Достоевский Ф. М.</div>
                    <div className="rate">
                        <fieldset className="rating yellow">
                            <input type="checkbox" id={"star" + (count + 5).toString()} name="rating"
                                   value="5"/>
                            <label className="full" htmlFor={"star" + (count + 5).toString()}></label>
                            <input type="checkbox" id={"star" + (count + 4).toString()} name="rating"
                                   value="4"/>
                            <label className="full" htmlFor={"star" + (count + 4).toString()}></label>
                            <input type="checkbox" id={"star" + (count + 3).toString()} name="rating"
                                   value="3"/>
                            <label className="full" htmlFor={"star" + (count + 3).toString()}></label>
                            <input type="checkbox" id={"star" + (count + 2).toString()} name="rating"
                                   value="2"/>
                            <label className="full" htmlFor={"star" + (count + 2).toString()}></label>
                            <input type="checkbox" id={"star" + (count + 1).toString()} name="rating"
                                   value="1"/>
                            <label className="full" htmlFor={"star" + (count + 1).toString()}></label>
                        </fieldset>
                        <span className="book-voters">Оценок: 1.987 </span>
                    </div>
                    <div className="book-sum">
                        Социально-психологический и социально-философский роман.
                    </div>
                    <div className="book-see">Подробнее</div>
                </div>
            </div>
        );
    }
    return str;
}

function Carousel() {
    return (
        <div className="book-slide">
            <Flickity
                className={'book'} // default ''
                elementType={'div'} // default 'div'
                options={flickityOptions} // takes flickity options {}
                disableImagesLoaded={false} // default false
                reloadOnUpdate // default false
                static // default false
            >
                <ShowUpperBooks/>
            </Flickity>
        </div>
    )
}

function App() {
    return (
        <div className="App">
            <Carousel/>
        </div>
    );
}

export default App;
