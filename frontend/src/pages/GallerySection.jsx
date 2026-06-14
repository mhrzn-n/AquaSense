import Container from "../components/Container";
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";

const images = [img1, img2, img3];

const GallerySection = () => {
  return (
    <Container>
      <section id="gallery" className="w-full py-12 md:py-20  min-h-[85vh] flex items-center">
        <div className="max-w-6xl px-4 mx-auto text-center">
          <h3 className="mb-10 text-2xl font-bold text-gray-800 md:text-3xl">
            Gallery
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="overflow-hidden transition-all duration-300 shadow-md rounded-xl hover:shadow-xl"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="object-cover w-full h-64 transition-transform duration-300 transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default GallerySection;
