import React, { useState } from 'react';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [visualizacion, setVisualizacion] = useState('');
  const [errores, setErrores] = useState({});
  const [productos, setProductos] = useState([]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    const precioNumero = parseFloat(precio);
    const stockNumero = parseInt(stock, 10);

    if (nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (descripcion.trim() === '') {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (precio === '') {
      nuevosErrores.precio = 'El precio es obligatorio';
    } else if (isNaN(precioNumero) || precioNumero <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }

    if (categoria === '') {
      nuevosErrores.categoria = 'Debe seleccionar una categoría';
    }

    if (stock === '') {
      nuevosErrores.stock = 'El stock es obligatorio';
    } else if (isNaN(stockNumero) || stockNumero < 0) {
      nuevosErrores.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!imagen) {
      nuevosErrores.imagen = 'Debe seleccionar una imagen';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const verImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (archivo.size > 2 * 1024 * 1024) {
        setErrores((prev) => ({
          ...prev,
          imagen: 'La imagen supera el tamaño permitido de 2MB.',
        }));
        setImagen(null);
        setVisualizacion('');
        return;
      }

      setImagen(archivo);
      setVisualizacion(URL.createObjectURL(archivo));
      setErrores((prev) => ({ ...prev, imagen: undefined }));
    }
  };

  const guardarProducto = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const nuevoProducto = {
      nombre,
      precio,
      categoria,
      descripcion,
      stock,
      visualizacion,
    };

    setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    setNombre('');
    setPrecio('');
    setCategoria('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setVisualizacion('');
    setErrores({});
  };

  const eliminarProducto = (index) => {
    const confirmacion = window.confirm('¿Desea eliminar este producto?');
    if (!confirmacion) {
      return;
    }
    setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
  };

  return (
    <div className="contenedor">
      <header className="titulo-principal">
        <div>
          <p className="badge">TIENDA TECH</p>
          <h1>Productos Tecnológicos</h1>
          <p className="subtitulo">Registra tus productos con descripción, stock y una imagen moderna.</p>
        </div>
        <div className="contador">
          Productos Registrados: <strong>{productos.length}</strong>
        </div>
      </header>

      <form className="formulario" onSubmit={guardarProducto}>
        <div className="form-grid">
          <div className="campo">
            <label>Nombre del producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Auriculares inalámbricos"
            />
            {errores.nombre && <p className="error">{errores.nombre}</p>}
          </div>

          <div className="campo">
            <label>Precio</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 129.99"
            />
            {errores.precio && <p className="error">{errores.precio}</p>}
          </div>

          <div className="campo">
            <label>Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Seleccione</option>
              <option value="Notebook">Notebook</option>
              <option value="MotherBoard">MotherBoard</option>
              <option value="Tarjeta gráfica">Tarjeta Gráfica RTX 5090</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Monitor">Monitor</option>
              <option value="Teclado mecánico">Teclado mecánico</option>
              <option value="Auriculares">Auriculares</option>
            </select>
            {errores.categoria && <p className="error">{errores.categoria}</p>}
          </div>

          <div className="campo">
            <label>Stock</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ej: 15"
            />
            {errores.stock && <p className="error">{errores.stock}</p>}
          </div>

          <div className="campo campo-textarea full-width">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el producto y sus características"
              rows="4"
            />
            {errores.descripcion && <p className="error">{errores.descripcion}</p>}
          </div>

          <div className="campo campo-file full-width">
            <label>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={verImagen} />
            {errores.imagen && <p className="error">{errores.imagen}</p>}
          </div>
        </div>

        {visualizacion && (
          <div className="preview">
            <h3>Vista previa</h3>
            <img src={visualizacion} alt="visualizacion" className="imagen-preview" />
          </div>
        )}

        <button className="btn-guardar" type="submit">
          Guardar Producto
        </button>
      </form>

      <section className="productos-registrados">
        <h2>Productos registrados</h2>
        <div className="lista-productos">
          {productos.map((producto, index) => (
            <article className="card" key={index}>
              {producto.visualizacion && (
                <img src={producto.visualizacion} alt={producto.nombre} className="card-imagen" />
              )}
              <div className="card-contenido">
                <h3>{producto.nombre}</h3>
                <p className="categoria">{producto.categoria}</p>
                <p className="descripcion">{producto.descripcion}</p>
                <p className="precio">Precio: <strong>${parseFloat(producto.precio).toFixed(2)}</strong></p>
                <p className="stock">Stock: {producto.stock} unidades</p>
              </div>
              <button className="btn-eliminar" type="button" onClick={() => eliminarProducto(index)}>
                Eliminar
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductForm;
