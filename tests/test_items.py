def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "FastAPI CRUD API"
    assert data["version"] == "1.0.0"


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_create_item(client):
    response = client.post("/items/", json={"title": "Test Item", "description": "A test"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Item"
    assert data["description"] == "A test"
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_item_empty_title(client):
    response = client.post("/items/", json={"title": ""})
    assert response.status_code == 422


def test_list_items_empty(client):
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == []


def test_list_items_with_data(client):
    client.post("/items/", json={"title": "Item 1"})
    client.post("/items/", json={"title": "Item 2"})
    response = client.get("/items/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_item_by_id(client):
    create_resp = client.post("/items/", json={"title": "Specific Item"})
    item_id = create_resp.json()["id"]
    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Specific Item"


def test_get_item_not_found(client):
    response = client.get("/items/999")
    assert response.status_code == 404


def test_update_item(client):
    create_resp = client.post("/items/", json={"title": "Original"})
    item_id = create_resp.json()["id"]
    response = client.put(f"/items/{item_id}", json={"title": "Updated", "completed": True})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"
    assert data["completed"] is True


def test_update_item_not_found(client):
    response = client.put("/items/999", json={"title": "Nope"})
    assert response.status_code == 404


def test_delete_item(client):
    create_resp = client.post("/items/", json={"title": "To Delete"})
    item_id = create_resp.json()["id"]
    response = client.delete(f"/items/{item_id}")
    assert response.status_code == 204
    get_response = client.get(f"/items/{item_id}")
    assert get_response.status_code == 404


def test_delete_item_not_found(client):
    response = client.delete("/items/999")
    assert response.status_code == 404
