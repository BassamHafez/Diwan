import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import TestimonialItem from "../../../Components/TestimonialItem/TestimonialItem";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useCallback, useState } from "react";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import { useTranslation } from "react-i18next";
import SearchField from "../../../Components/Search/SearchField";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddTestimonial from "./TestimonialsForms/AddTestimonial";

const AdminTestimonials = () => {
  const [showAddTestimonialsModal, setShowAddTestimonialsModal] =
    useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const { t: key } = useTranslation();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => mainFormsHandlerTypeRaw({ type: "testimonials" }),
    staleTime: Infinity,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredData =
    data && Array.isArray(data?.data)
      ? data?.data?.filter(
          (comment) =>
            !searchFilter ||
            comment.name
              .trim()
              .toLowerCase()
              .includes(searchFilter.trim().toLowerCase()) ||
            comment.title
              .trim()
              .toLowerCase()
              .includes(searchFilter.trim().toLowerCase())
        )
      : [];

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {!filteredData || (isFetching && <LoadingOne />)}

        <div className="my-4">
          <MainTitle title={key("testimonials")} />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-3 p-2">
          <div className="my-2">
            <SearchField onSearch={onSearch} text={key("searchTestimonials")} />
          </div>
          <div>
            <ButtonOne
              onClick={() => setShowAddTestimonialsModal(true)}
              borderd={true}
              text={key("add")}
              classes="my-2"
            />
          </div>
        </div>
        <Row className="g-3">
          {filteredData?.length > 0 ? (
            filteredData?.map((content) => (
              <Col key={content?._id} sm={12}>
                <TestimonialItem
                  isAdmin={true}
                  content={content}
                  refetch={refetch}
                />
              </Col>
            ))
          ) : (
            <NoData text={key("noTestimonials")} />
          )}
        </Row>
      </div>
      {showAddTestimonialsModal && (
        <ModalForm
          show={showAddTestimonialsModal}
          onHide={() => setShowAddTestimonialsModal(false)}
        >
          <AddTestimonial
            refetch={refetch}
            hideModal={() => setShowAddTestimonialsModal(false)}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AdminTestimonials;
